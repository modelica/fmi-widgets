import * as React from 'react';
import './support_matrix.css';
import { MatrixReport, SupportStatus, RowReport } from 'fmi-database';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Button } from '@blueprintjs/core';

async function queryDetails(): Promise<MatrixReport> {
  let headers = new Headers({
    "Accept": "application/json",
  });
  headers.set("Accept", "application/json");

  let req = new Request("http://localhost:4000/report/matrix", {
    method: "GET",
    headers: headers,
  });
  let resp = await fetch(req);
  return resp.json();
}

// interface ImportListing {
//   id: string;
//   name: string;
//   exporters: ImportReport[];
// }

@observer
export class SupportMatrixViewer extends React.Component<{}, {}> {
  @observable matrix: MatrixReport = { exporters: [], importers: [] };
  @observable loading = true;
  @observable selected: string | null = null;
  @computed get export_tools(): { [id: string]: string } {
    let ret = {};
    this.matrix.exporters.forEach((exp) => {
      ret[exp.id] = exp.name;
      exp.columns.forEach((imp) => {
        ret[imp.id] = imp.name;
      });
    });
    return ret;
  }
  @computed get import_tools(): { [id: string]: string } {
    let ret = {};
    this.matrix.exporters.forEach((exp) => {
      ret[exp.id] = exp.name;
      exp.columns.forEach((imp) => {
        ret[imp.id] = imp.name;
      });
    });
    return ret;
  }
  @computed get exportsTo(): RowReport | null {
    if (this.selected == null) return null;

    for (let i = 0; i < this.matrix.exporters.length; i++) {
      if (this.matrix.exporters[i].id === this.selected) return this.matrix.exporters[i];
    }
    // Happens if tool doesn't support export
    return null;
  }
  @computed get importsFrom(): RowReport | null {
    if (this.selected == null) return null;

    for (let i = 0; i < this.matrix.importers.length; i++) {
      if (this.matrix.importers[i].id === this.selected) return this.matrix.importers[i];
    }
    // Happens if tool doesn't export
    return null;
  }
  constructor(props?: {}, context?: {}) {
    super(props, context);
    queryDetails().then((r) => {
      this.matrix = r;
      this.loading = false;
    });
  }
  render() {
    let supportBox = (support: SupportStatus) => (
      <div className="pt-button-group" style={{ marginBottom: "4px" }}>
        <a className="pt-button pt-intent-success" tabIndex={0} role="button">{support.passed}</a>
        <a className="pt-button pt-intent-warning" tabIndex={0} role="button">{support.rejected}</a>
        <a className="pt-button pt-intent-danger" tabIndex={0} role="button">{support.failed}</a>
      </div>
    );

    return (
      <div className="Support">
        <div style={{ display: "flex" }}>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            FMI Version
            <div className="pt-select">
              <select>
                <option selected={true} value={undefined}>All Versions</option>
                <option value="FMI_1.0">FMI 1.0</option>
                <option value="FMI_2.0">FMI 2.0</option>
              </select>
            </div>
          </label>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            FMI Variant
            <div className="pt-select">
              <select>
                <option selected={true} value={undefined}>All Variants</option>
                <option value="CoSimulation">Co-Simulation</option>
                <option value="ModelExchange">Model Exchange</option>
              </select>
            </div>
          </label>
          <label className="pt-label pt-inline" style={{ marginLeft: "20px" }}>
            Platform
            <div className="pt-select">
              <select>
                <option selected={true} value={undefined}>All Platforms</option>
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
        {this.loading && <p>Loading...</p>}
        {!this.loading && <div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {Object.keys(this.export_tools).map((id, ti) => {
              return <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                <Button style={{ width: "100%" }} active={this.selected === id} onClick={() => this.selected = id}>{this.export_tools[id]}</Button>
              </div>;
            })}
          </div>
          {this.selected && <div>
            <h2>{this.export_tools[this.selected]}</h2>
            <div style={{ margin: 5, display: "flex" }}>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Imports From:</h3>
                {this.importsFrom && this.importsFrom.columns.map((exp) => {
                  return (
                    <div key={exp.id}>
                      <h4>{exp.name}</h4>
                      {supportBox(exp.summary)}
                    </div>);
                })}
              </div>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Exports To:</h3>
                {this.exportsTo && this.exportsTo.columns.map((exp) => {
                  return (
                    <div key={exp.id}>
                      <h4>{exp.name}</h4>
                      {supportBox(exp.summary)}
                    </div>);
                })}
              </div>
            </div>
          </div>}
        </div>}
      </div>
    );
  }
}
