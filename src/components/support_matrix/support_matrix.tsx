import * as React from "react";
import "./support_matrix.css";
import { observer } from "mobx-react";
import { QueryFunction } from "../data";
import { FMISpinner } from "./spinner";
import { Filter } from "./filter";
import { ViewState } from "../state";
import { ButtonStack, Justification } from "./stack";
import { ZoomView } from "./zoom";
import { truncate } from "../utils";
import { Columns } from "./columns";
import { Unchecked } from "./unchecked";
import { Colors } from "@blueprintjs/core";

const colDivStyle: React.CSSProperties = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
};

const stackStyle: React.CSSProperties = {
    flexGrow: 0,
};

export interface SupportMatrixProps {
    query: QueryFunction;
}

@observer
export class SupportMatrixViewer extends React.Component<SupportMatrixProps, {}> {
    private viewState: ViewState;

    constructor(props: SupportMatrixProps, context: {}) {
        super(props, context);
        // TODO: Use new React 16.3 Context API to create a provider/consumer pair...
        this.viewState = new ViewState(props.query);
    }

    render() {
        let importStyle = (id: string) => ({ backgroundColor: Colors.FOREST5 });
        let exportStyle = (id: string) => ({ backgroundColor: Colors.FOREST5 });
        let renderLabel = (id: string) => {
            let tool = this.viewState.results.get().tools.find(summary => summary.id === id);
            if (!tool) return <span>Unknown Tool: {id}</span>; // Should not happen
            return <span>{truncate(tool.displayName)}</span>;
        };

        let columns = this.viewState.columns;
        let exportOnly = columns.export_only.filter(this.viewState.matchesTerm);
        let both = columns.both.filter(this.viewState.matchesTerm);
        let importOnly = columns.import_only.filter(this.viewState.matchesTerm);

        return (
            <div className="Support" style={{ margin: "10px" }}>
                <Filter settings={this.viewState} />
                {/* Show spinner if the data hasn't loaded yet */}
                {this.viewState.loading && FMISpinner}
                {!this.viewState.loading && (
                    <div>
                        <p>Select a tool to find out more about its FMI capabilities...</p>
                        <div style={{ display: "flex", marginBottom: "30px" }}>
                            <Columns style={{ flexGrow: 1 }}>
                                <div style={colDivStyle}>
                                    <h4>
                                        Export only&nbsp;<span className="pt-icon-arrow-right" />
                                    </h4>
                                    <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                    {exportOnly.length === 0 ? (
                                        <p>No tools match filter parameters</p>
                                    ) : (
                                        <ButtonStack
                                            ids={exportOnly}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={exportStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    )}
                                    <Unchecked imports={false} viewState={this.viewState} />
                                </div>
                                <div style={colDivStyle}>
                                    <h4>
                                        <span className="pt-icon-arrow-right" />&nbsp;Import and Export&nbsp;<span className="pt-icon-arrow-right" />
                                    </h4>
                                    <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                    {both.length === 0 ? (
                                        <p>No tools match filter parameters</p>
                                    ) : (
                                        <ButtonStack
                                            ids={both}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    )}
                                </div>
                                <div style={colDivStyle}>
                                    <h4>
                                        <span className="pt-icon-arrow-right" />&nbsp;Import only
                                    </h4>
                                    <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                    {importOnly.length === 0 ? (
                                        <p>No tools match filter parameters</p>
                                    ) : (
                                        <ButtonStack
                                            ids={importOnly}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    )}
                                    <Unchecked imports={true} viewState={this.viewState} />
                                </div>
                            </Columns>
                        </div>
                        <ZoomView viewState={this.viewState} tools={columns.tools} />
                        {/* <SupportGraph matrix={this.matrix.get()} /> */}
                    </div>
                )}
            </div>
        );
    }
}
