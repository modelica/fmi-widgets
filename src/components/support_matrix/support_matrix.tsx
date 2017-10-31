import * as React from 'react';
import './support_matrix.css';
import { MatrixReport, SupportStatus, RowReport, ColumnReport } from 'fmi-database';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { promisedComputed } from 'computed-async-mobx';
import { Button, ProgressBar, Tooltip } from '@blueprintjs/core';

const versionKey = "version";
const variantKey = "variant";
const platformKey = "platform";

async function queryDetails(version: string | undefined, variant: string | undefined, platform: string | undefined): Promise<MatrixReport> {
  let qs: { [key: string]: string } = {};
  if (version) qs[versionKey] = version;
  if (variant) qs[variantKey] = variant;
  if (platform) qs[platformKey] = platform;

  let headers = new Headers({
    "Accept": "application/json",
  });
  headers.set("Accept", "application/json");

  let qsstr = Object.keys(qs).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(qs[k])).join("&");

  let req = new Request(`http://localhost:4000/report/matrix?${qsstr}`, {
    method: "GET",
    headers: headers,
  });
  let resp = await fetch(req);
  return resp.json();
}

const supportBox = (support: SupportStatus, title: string | undefined, style?: React.CSSProperties) => (
  <div className="pt-button-group pt-inline" style={style || {}}>
    {title && <label className="limited" style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "5px", marginRight: "5px" }}>{title}</label>}
    <a className="pt-button pt-intent-success" style={{ flexGrow: 1 }} tabIndex={0} role="button">{support.passed}</a>
    <a className="pt-button pt-intent-warning" style={{ flexGrow: 1 }} tabIndex={0} role="button">{support.rejected}</a>
    <a className="pt-button pt-intent-danger" style={{ flexGrow: 1 }} tabIndex={0} role="button">{support.failed}</a>
  </div>
);

const emptyMatrix: MatrixReport = { exporters: [], importers: [] };

function truncate(str: string): string {
  if (str.length > 12) return str.slice(0, 12) + "...";
  return str;
}

const toolboxDiv = {
  textAlign: "center",
  padding: "4px",
  borderRadius: "6px",
  border: "1px solid #cccccc",
  margin: "2px",
  backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
  color: "#182026",
};
const importsFromDiv = {
  minWidth: "400px",
  width: "50%",
  paddingTop: "30x",
  paddintBottom: "20px",
  paddingRight: "20px",
  borderTopRightRadius: "20px",
  borderBottomRightRadius: "20px",
  borderRight: "1px solid black",
  textAlign: "end"
};
// interface ImportListing {
//   id: string;
//   name: string;
//   exporters: ImportReport[];
// }
const flexBasis = "auto";

@observer
export class SupportMatrixViewer extends React.Component<{}, {}> {
  @observable matrix2: MatrixReport = emptyMatrix;
  @observable selected: string | null = null;
  @observable version: string | undefined = undefined;
  @observable variant: string | undefined = undefined;
  @observable platform: string | undefined = undefined;
  matrix = promisedComputed<MatrixReport>(emptyMatrix, () => {
    console.log("Computing matrix");
    return queryDetails(this.version, this.variant, this.platform);
  });
  @computed get loading() { return this.matrix.busy; }
  @computed get export_tools(): { [id: string]: string } {
    let ret = {};
    this.matrix.get().exporters.forEach((exp) => {
      ret[exp.id] = exp.name;
      exp.columns.forEach((imp) => {
        ret[imp.id] = imp.name;
      });
    });
    return ret;
  }
  @computed get import_tools(): { [id: string]: string } {
    let ret = {};
    this.matrix.get().exporters.forEach((exp) => {
      ret[exp.id] = exp.name;
      exp.columns.forEach((imp) => {
        ret[imp.id] = imp.name;
      });
    });
    return ret;
  }
  @computed get exportsTo(): RowReport | null {
    if (this.selected == null) return null;

    for (let i = 0; i < this.matrix.get().exporters.length; i++) {
      if (this.matrix.get().exporters[i].id === this.selected) return this.matrix.get().exporters[i];
    }
    // Happens if tool doesn't support export
    return null;
  }
  @computed get importsFrom(): RowReport | null {
    if (this.selected == null) return null;

    for (let i = 0; i < this.matrix.get().importers.length; i++) {
      if (this.matrix.get().importers[i].id === this.selected) return this.matrix.get().importers[i];
    }
    // Happens if tool doesn't export
    return null;
  }
  constructor(props?: {}, context?: {}) {
    super(props, context);
    // queryDetails(undefined, undefined, undefined).then((r) => {
    //   this.matrix = r;
    //   this.loading = false;
    // });
  }
  render() {
    let leftArrow = (id: string) => {
      let exports = this.matrix.get().exporters.some((exp) => exp.id === id);
      let imports = this.matrix.get().exporters.some((exp) => exp.columns.some((imp) => imp.id === id));
      if (imports && !exports) return <span className="pt-icon-arrow-right" />;
      return null;
    };
    let rightArrow = (id: string) => {
      let exports = this.matrix.get().exporters.some((exp) => exp.id === id);
      let imports = this.matrix.get().exporters.some((exp) => exp.columns.some((imp) => imp.id === id));
      if (imports && exports) return <span className="pt-icon-arrows-horizontal" />;
      if (imports) return null;
      if (exports) return <span className="pt-icon-arrow-right" />;
      return <span className="pt-icon-ban-circle" />;
    };

    let ekeys = Object.keys(this.export_tools);
    let io: string[] = [];
    let eo: string[] = [];
    let both: string[] = [];

    ekeys.forEach((key) => {
      let exports = this.matrix.get().exporters.some((exp) => exp.id === key);
      let imports = this.matrix.get().exporters.some((exp) => exp.columns.some((imp) => imp.id === key));
      if (imports && exports) both.push(key);
      if (imports && !exports) io.push(key);
      if (exports && !imports) eo.push(key);
    });

    return (
      <div className="Support" style={{ margin: "10px" }}>
        <div style={{ display: "flex" }}>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            FMI Version
            <div className="pt-select">
              <select defaultValue={undefined} onChange={(event) => this.version = event.target.value as string}>
                <option value={undefined}>All Versions</option>
                <option value="FMI_1.0">FMI 1.0</option>
                <option value="FMI_2.0">FMI 2.0</option>
              </select>
            </div>
          </label>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            FMI Variant
            <div className="pt-select">
              <select defaultValue={undefined} onChange={(event) => this.variant = event.target.value}>
                <option value={undefined}>All Variants</option>
                <option value="CoSimulation">Co-Simulation</option>
                <option value="ModelExchange">Model Exchange</option>
              </select>
            </div>
          </label>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            Platform
            <div className="pt-select">
              <select defaultValue={undefined} onChange={(event) => this.platform = event.target.value}>
                <option value={undefined}>All Platforms</option>
                <option value="win32">Windows, 32-bit</option>
                <option value="win64">Windows, 64-bit</option>
                <option value="linux32">Linux, 32-bit</option>
                <option value="linux64">Linux, 64-bit</option>
                <option value="darwin32">Darwin, 32-bit</option>
                <option value="darwin64">Darwin, 64-bit</option>
                <option value="c-code">C Code</option>
              </select>
            </div>
          </label>
        </div>
        {this.loading && <div style={{ margin: "10px" }}><ProgressBar /></div>}
        {!this.loading && ekeys.length === 0 && <p>No tools match your filter parameters</p>}
        {
          !this.loading && ekeys.length > 0 && <div>
            <p>Select a tool to find out more about its FMI capabilities...</p>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1, flexBasis: flexBasis, textAlign: "center", borderRight: "1px dashed black", paddingRight: "5px", marginRight: "5px" }}>
                <h4>Import only</h4>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {io.map((id, ti) => {
                    return <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                      <Button style={{ width: "100%" }} active={this.selected === id} onClick={() => this.selected = id}>
                        <small>{leftArrow(id)}</small>&nbsp;
                        <span>{truncate(this.export_tools[id])}</span>
                        &nbsp;<small>{rightArrow(id)}</small>
                      </Button>
                    </div>;
                  })}
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: flexBasis, textAlign: "center" }}>
                <h4>Import and Export</h4>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {both.map((id, ti) => {
                    return <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                      <Button style={{ width: "100%" }} active={this.selected === id} onClick={() => this.selected = id}>
                        <small>{leftArrow(id)}</small>&nbsp;
                        <span>{truncate(this.export_tools[id])}</span>
                        &nbsp;<small>{rightArrow(id)}</small>
                      </Button>
                    </div>;
                  })}
                </div>
              </div>
              <div style={{ flexGrow: 1, flexBasis: flexBasis, textAlign: "center", borderLeft: "1px dashed black", paddingLeft: "5px", marginLeft: "5px" }}>
                <h4>Export only</h4>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {eo.map((id, ti) => {
                    return <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                      <Button style={{ width: "100%" }} active={this.selected === id} onClick={() => this.selected = id}>
                        <small>{leftArrow(id)}</small>&nbsp;
                        <span>{truncate(this.export_tools[id])}</span>
                        &nbsp;<small>{rightArrow(id)}</small>
                      </Button>
                    </div>;
                  })}
                </div>
              </div>
            </div>
            {this.selected && ekeys.indexOf(this.selected) >= 0 && <div>
              <div style={{ marginTop: 20, margin: 5, display: "flex" }}>
                <div style={importsFromDiv}>
                  <h4 style={{ paddingTop: "10px" }}>Imports From:</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {this.importsFrom && this.importsFrom.columns.length === 0 && <p>No tools import from {this.export_tools[this.selected]}</p>}
                    {this.importsFrom && this.importsFrom.columns.map((imp) => {
                      return (
                        <Tooltip key={imp.id} content={<VersionTable report={imp} />}>
                          <div style={toolboxDiv}>
                            {supportBox(imp.summary, imp.name)}
                          </div>
                        </Tooltip>);
                    })}
                  </div>
                </div>
                <div style={{ margin: "10px" }}>
                  <h2 style={{ whiteSpace: "nowrap" }}>
                    <span className="pt-icon-arrow-right" />
                    &nbsp;<span className="limited" style={{ height: "1.5em", verticalAlign: "top" }}>{this.export_tools[this.selected]}</span>&nbsp;
                  <span className="pt-icon-arrow-right" />
                  </h2>
                </div>
                <div style={{ minWidth: "400px", width: "50%", paddingTop: "30x", paddingBottom: "20px", paddingLeft: "20px", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", borderLeft: "1px solid black" }}>
                  <h4 style={{ paddingTop: "10px" }}>Exports To:</h4>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {this.exportsTo && this.exportsTo.columns.length === 0 && <p>No tools export to {this.export_tools[this.selected]}</p>}
                    {this.exportsTo && this.exportsTo.columns.map((exp) => {
                      return (
                        <Tooltip key={exp.id} content={<VersionTable report={exp} />}>
                          <div key={exp.id} style={toolboxDiv}>
                            {supportBox(exp.summary, exp.name)}
                          </div>
                        </Tooltip>);
                    })}
                  </div>
                </div>
              </div>
            </div>}
          </div>
        }
      </div >
    );
  }
}

@observer
export class VersionTable extends React.Component<{ report: ColumnReport }, {}> {
  render() {
    if (this.props.report.rows.length === 0) return null;
    let rows = this.props.report.rows[0];
    return (
      <table>
        <tbody>
          <tr>
            <td />
            {rows.cols.map((col, ci) => <th key={ci}>{col.version}</th>)}
          </tr>
          {this.props.report.rows.map((row, ri) => {
            return (
              <tr key={ri}>
                <th>{row.version}</th>
                {row.cols.map((col, ci) => {
                  return <td key={ci}>
                    {col.status.passed === 0 && col.status.rejected === 0 && col.status.failed === 0 ? null : supportBox(col.status, undefined, { display: "flex" })}
                  </td>;
                })}
              </tr>);
          })}
        </tbody>
      </table>);
  }
}