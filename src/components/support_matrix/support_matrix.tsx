import * as React from "react";
import "./support_matrix.css";
import { observer } from "mobx-react";
import { QueryFunction } from "../data";
import { FMISpinner } from "./spinner";
import { Filter } from "./filter";
import { ViewState } from "../state";
import { supportLevel, supportColor } from "./logic";
import { ButtonStack, Justification } from "./stack";
import { ZoomView } from "./zoom";
import { truncate } from "../utils";
import { Columns } from "./columns";

export interface SupportMatrixProps {
    query: QueryFunction;
}

@observer
export class SupportMatrixViewer extends React.Component<SupportMatrixProps, {}> {
    private viewState: ViewState;

    constructor(props: SupportMatrixProps, context: {}) {
        super(props, context);
        this.viewState = new ViewState(props.query);
    }

    render() {
        let importStyle = (id: string) => ({ backgroundColor: supportColor(supportLevel(this.viewState, id, false)) });
        let exportStyle = (id: string) => ({ backgroundColor: supportColor(supportLevel(this.viewState, id, true)) });
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
                                    <div>
                                        <h4>
                                            Export only&nbsp;<span className="pt-icon-arrow-right" />
                                        </h4>
                                        <ButtonStack
                                            ids={columns.export_only}
                                            viewState={this.viewState}
                                            style={exportStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    </div>
                                    <div>
                                        <h4>
                                            <span className="pt-icon-arrow-right" />&nbsp;Import and Export&nbsp;<span className="pt-icon-arrow-right" />
                                        </h4>
                                        <ButtonStack
                                            ids={columns.both}
                                            viewState={this.viewState}
                                            style={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
                                    </div>
                                    <div>
                                        <h4>
                                            <span className="pt-icon-arrow-right" />&nbsp;Import only
                                        </h4>
                                        <ButtonStack
                                            ids={columns.import_only}
                                            viewState={this.viewState}
                                            style={importStyle}
                                            renderLabel={renderLabel}
                                            justification={Justification.Block}
                                        />
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
