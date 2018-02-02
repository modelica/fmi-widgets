import * as React from "react";
import { Tooltip, Classes, Overlay, Position } from "@blueprintjs/core";
import { ViewState } from "./view_state";
import { observer } from "mobx-react";
import { toolboxDivStyle, importsFromDiv, exportsToDiv } from "./style";
import { VersionTable, supportBox } from "./version_table";
import { truncate } from "../utils";

export interface ZoomViewProps {
    viewState: ViewState;
    ekeys: string[];
}

@observer
export class ZoomView extends React.Component<ZoomViewProps, {}> {
    render() {
        return (
            <Overlay
                className={Classes.OVERLAY_SCROLL_CONTAINER}
                isOpen={
                    !!(this.props.viewState.selected && this.props.ekeys.indexOf(this.props.viewState.selected) >= 0)
                }
                onClose={() => (this.props.viewState.selected = null)}
                lazy={true}
                transitionDuration={500}
            >
                <div style={{ width: "80%", left: "10%", right: "10%", marginTop: "10vh" }}>
                    {this.props.viewState.selected &&
                        this.props.ekeys.indexOf(this.props.viewState.selected) >= 0 && (
                            <div>
                                <div
                                    style={{
                                        marginTop: 20,
                                        margin: 5,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <div style={importsFromDiv}>
                                        <h4 style={{ paddingTop: "10px" }}>Imports From:</h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            {this.props.viewState.importsFrom &&
                                                this.props.viewState.importsFrom.columns.length === 0 && (
                                                    <p>
                                                        No tools import from{" "}
                                                        {
                                                            this.props.viewState.export_tools[
                                                                this.props.viewState.selected
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            {this.props.viewState.importsFrom &&
                                                this.props.viewState.importsFrom.columns.map(imp => {
                                                    return (
                                                        <Tooltip
                                                            position={Position.RIGHT}
                                                            key={imp.id}
                                                            content={<VersionTable report={imp} />}
                                                        >
                                                            <div style={toolboxDivStyle(imp.summary)}>
                                                                {supportBox(
                                                                    imp.summary,
                                                                    imp.name,
                                                                    {},
                                                                    () => (this.props.viewState.selected = imp.id),
                                                                )}
                                                            </div>
                                                        </Tooltip>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <div style={{ margin: "10px" }}>
                                        <h2 style={{ whiteSpace: "nowrap" }}>
                                            <span className="pt-icon-arrow-right" />
                                            &nbsp;<span style={{ height: "1.5em", verticalAlign: "top" }}>
                                                {truncate(
                                                    this.props.viewState.export_tools[this.props.viewState.selected],
                                                )}
                                            </span>&nbsp;
                                            <span className="pt-icon-arrow-right" />
                                        </h2>
                                    </div>
                                    <div style={exportsToDiv}>
                                        <h4 style={{ paddingTop: "10px" }}>Exports To:</h4>
                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            {this.props.viewState.exportsTo &&
                                                this.props.viewState.exportsTo.columns.length === 0 && (
                                                    <p>
                                                        No tools export to{" "}
                                                        {
                                                            this.props.viewState.export_tools[
                                                                this.props.viewState.selected
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            {this.props.viewState.exportsTo &&
                                                this.props.viewState.exportsTo.columns.map(exp => {
                                                    return (
                                                        <Tooltip
                                                            position={Position.LEFT}
                                                            key={exp.id}
                                                            content={<VersionTable report={exp} />}
                                                        >
                                                            <div key={exp.id} style={toolboxDivStyle(exp.summary)}>
                                                                {supportBox(
                                                                    exp.summary,
                                                                    exp.name,
                                                                    {},
                                                                    () => (this.props.viewState.selected = exp.id),
                                                                )}
                                                            </div>
                                                        </Tooltip>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </Overlay>
        );
    }
}
