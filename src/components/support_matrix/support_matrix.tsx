import * as React from 'react';
import './support_matrix.css';
import { ToolDetails } from 'fmi-database';
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
  @observable selected: number | null = null;
  constructor(props?: {}, context?: {}) {
    super(props, context);
    queryDetails().then((r) => {
      this.details = r;
      this.loading = false;
    });
  }
  render() {
    return (
      <div className="Support">
        {this.loading && <p>Loading...</p>}
        {!this.loading && <div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {this.details.map((tool, ti) => {
              return <div key={tool.id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                <Button style={{ width: "100%" }} active={this.selected === ti} onClick={() => this.selected = ti}>{tool.name}</Button>
              </div>;
            })}
          </div>
          {this.selected && <div>
            <h2>{this.details[this.selected].name}</h2>
            <div style={{ margin: 5, display: "flex" }}>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Imports From:</h3>
              </div>
              <div style={{ minWidth: "400px", width: "50%" }}>
                <h3>Exports To:</h3>
              </div>
            </div>
          </div>}
        </div>}
      </div>
    );
  }
}
