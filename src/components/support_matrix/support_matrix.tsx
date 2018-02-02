import * as React from "react";
import "./support_matrix.css";
import { observer } from "mobx-react";
import { QueryFunction } from "../data";
import { FMISpinner } from "./spinner";
import { Filter } from "./filter";
import { ViewState } from "./view_state";
import { supportLevel, supportColor } from "./logic";
import { ButtonStack } from "./stack";
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
        let leftArrow = (id: string) => {
            let exports = this.viewState.matrix.get().exporters.some(exp => exp.id === id);
            let imports = this.viewState.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === id));
            if (imports && !exports) return <span className="pt-icon-arrow-right" />;
            return null;
        };
        let rightArrow = (id: string) => {
            let exports = this.viewState.matrix.get().exporters.some(exp => exp.id === id);
            let imports = this.viewState.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === id));
            if (imports && exports) return <span className="pt-icon-arrows-horizontal" />;
            if (imports) return null;
            if (exports) return <span className="pt-icon-arrow-right" />;
            return <span className="pt-icon-ban-circle" />;
        };

        let ekeys = Object.keys(this.viewState.export_tools);
        let io: string[] = [];
        let eo: string[] = [];
        let both: string[] = [];

        ekeys.forEach(key => {
            let exports = this.viewState.matrix.get().exporters.some(exp => exp.id === key);
            let imports = this.viewState.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === key));
            if (imports && exports) both.push(key);
            if (imports && !exports) io.push(key);
            if (exports && !imports) eo.push(key);
        });

        this.viewState.matrix.get().tools.forEach(tool => {
            if (io.indexOf(tool) === -1 && eo.indexOf(tool) === -1 && both.indexOf(tool) === -1) {
                console.log("Tool " + tool + " provides no cross-check data");
            }
        });

        let importStyle = (id: string) => ({ backgroundColor: supportColor(supportLevel(this.viewState, id, false)) });
        let exportStyle = (id: string) => ({ backgroundColor: supportColor(supportLevel(this.viewState, id, true)) });
        let renderLabel = (id: string) => (
            <div>
                <small>{leftArrow(id)}</small>&nbsp;
                <span>{truncate(this.viewState.export_tools[id])}</span>
                &nbsp;<small>{rightArrow(id)}</small>
            </div>
        );

        return (
            <div className="Support" style={{ margin: "10px" }}>
                <Filter settings={this.viewState} />
                {/* Show spinner if the data hasn't loaded yet */}
                {this.viewState.loading && FMISpinner}
                {!this.viewState.loading && ekeys.length === 0 && <p>No tools match your filter parameters</p>}
                {!this.viewState.loading &&
                    ekeys.length > 0 && (
                        <div>
                            <p>Select a tool to find out more about its FMI capabilities...</p>
                            <div style={{ display: "flex", marginBottom: "30px" }}>
                                <Columns>
                                    <div>
                                        <h4>Export only</h4>
                                        <ButtonStack
                                            ids={eo}
                                            viewState={this.viewState}
                                            style={exportStyle}
                                            renderLabel={renderLabel}
                                        />
                                    </div>
                                    <div>
                                        <h4>Import and Export</h4>
                                        <ButtonStack
                                            ids={both}
                                            viewState={this.viewState}
                                            style={importStyle}
                                            renderLabel={renderLabel}
                                        />
                                    </div>
                                    <div>
                                        <h4>Import only</h4>
                                        <ButtonStack
                                            ids={io}
                                            viewState={this.viewState}
                                            style={importStyle}
                                            renderLabel={renderLabel}
                                        />
                                    </div>
                                </Columns>
                            </div>
                            <ZoomView viewState={this.viewState} ekeys={ekeys} />
                            {/* <SupportGraph matrix={this.matrix.get()} /> */}
                        </div>
                    )}
            </div>
        );
    }
}
