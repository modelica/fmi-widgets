import * as React from 'react';
import './support_matrix.css';
import { ToolDetails, SupportType } from 'fmi-database';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button } from '@blueprintjs/core';

async function queryDetails(): Promise<ToolDetails[]> {
  let headers = new Headers({
    "Accept": "application/json",
  });
  headers.set("Accept", "application/json");

  let req = new Request("http://localhost:4000/details", {
    method: "GET",
    headers: headers,
  });
  let resp = await fetch(req);
  return resp.json();
}

@observer
export class SupportMatrixViewer extends React.Component<{}, {}> {
  @observable details: ToolDetails[] = [];
  @observable loading = true;
  @observable selected: string | null = null;
  constructor(props?: {}, context?: {}) {
    super(props, context);
    queryDetails().then((r) => {
      this.details = r;
      this.loading = false;
    });
  }
  render() {
    let idx = this.details.findIndex((d) => d.id === this.selected);
    let details: ToolDetails | null = idx >= 0 ? this.details[idx] : null;
    let supports = (t: SupportType[]) => (
      <div>
        <ul>
          {t.map((support, si) => (
            <li key={si}>{support.name}
              <ul>
                {support.versions.map((version, i) => <li key={i}>{version.version}:
                  <div className="pt-button-group">
                    <a className="pt-button pt-intent-success" tabIndex={0} role="button">{version.passed}</a>
                    <a className="pt-button pt-intent-warning" tabIndex={0} role="button">{version.rejected}</a>
                    <a className="pt-button pt-intent-danger" tabIndex={0} role="button">{version.failed}</a>
                  </div>
                </li>)}
              </ul>
            </li>
          ))}
        </ul>
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
            {this.details.map((tool, ti) => {
              return <div key={tool.id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                <Button style={{ width: "100%" }} active={this.selected === tool.id} onClick={() => this.selected = tool.id}>{tool.name}</Button>
              </div>;
            })}
          </div>
          {details && <div>
            <h2>{details.name}</h2>
            <div style={{ margin: 5, display: "flex" }}>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Imports From:</h3>
                {details.versions.map((version, vi) => {
                  return (<div key={vi}>
                    <h4>{version.version}</h4>
                    {supports(version.importsFrom)}
                  </div>);
                })}
              </div>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Exports To:</h3>
                {details.versions.map((version, vi) => {
                  return (<div key={vi}>
                    <h4>{version.version}</h4>
                    {supports(version.exportsTo)}
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
