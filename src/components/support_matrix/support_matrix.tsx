import * as React from "react";
import "./support_matrix.css";
import { observer } from "mobx-react";
import { QueryFunction } from "../data";
import { FMISpinner } from "./spinner";
import { Filter } from "./filter";
import { ViewState } from "../state";
import { supportColor } from "./logic";
import { ButtonStack, Justification } from "./stack";
import { ZoomView } from "./zoom";
import { truncate } from "../utils";
import { Columns } from "./columns";
import { Unchecked } from "./unchecked";

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
        let importStyle = (id: string) => ({ backgroundColor: supportColor(this.viewState, id, false) });
        let exportStyle = (id: string) => ({ backgroundColor: supportColor(this.viewState, id, true) });
        let renderLabel = (id: string) => <span>{truncate(this.viewState.export_tools[id])}</span>;

        let columns = this.viewState.columns;

        return (
            <div className="Support" style={{ margin: "10px" }}>
                <Filter settings={this.viewState} />
                {/* Show spinner if the data hasn't loaded yet */}
                {this.viewState.loading && FMISpinner}
                {!this.viewState.loading && columns.tools.length === 0 && <p>No tools match your filter parameters</p>}
                {!this.viewState.loading &&
                    columns.tools.length > 0 && (
                        <div>
                            <p>Select a tool to find out more about its FMI capabilities...</p>
                            <div style={{ display: "flex", marginBottom: "30px" }}>
                                <Columns>
                                    <div style={colDivStyle}>
                                        <h4>
                                            Export only&nbsp;<span className="pt-icon-arrow-right" />
                                        </h4>
                                        <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                        <ButtonStack
                                            ids={columns.export_only}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={exportStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                        <Unchecked imports={true} viewState={this.viewState} />
                                    </div>
                                    <div style={colDivStyle}>
                                        <h4>
                                            <span className="pt-icon-arrow-right" />&nbsp;Import and Export&nbsp;<span className="pt-icon-arrow-right" />
                                        </h4>
                                        <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                        <ButtonStack
                                            ids={columns.both}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    </div>
                                    <div style={colDivStyle}>
                                        <h4>
                                            <span className="pt-icon-arrow-right" />&nbsp;Import only
                                        </h4>
                                        <h5 style={{ textAlign: "left" }}>Cross-Checked</h5>
                                        <ButtonStack
                                            ids={columns.import_only}
                                            style={stackStyle}
                                            viewState={this.viewState}
                                            buttonStyle={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                        <Unchecked imports={false} viewState={this.viewState} />
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
