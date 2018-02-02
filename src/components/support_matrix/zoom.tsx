import * as React from "react";
import { Tooltip, Classes, Overlay, Position } from "@blueprintjs/core";
import { ViewState } from "./view_state";
import { observer } from "mobx-react";
import { toolboxDivStyle, importsFromDiv, exportsToDiv } from "./style";
import { VersionTable, supportBox } from "./version_table";
import { ButtonStack, Justification } from "./stack";

export interface ZoomViewProps {
    viewState: ViewState;
    tools: string[];
}

const backgrounDivStyle: React.CSSProperties = {
    backgroundColor: "white",
};

const columnDivStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 5,
    paddingRight: 5,
};

const rowDivStyle: React.CSSProperties = {
    paddingTop: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "column",
};

@observer
export class ZoomView extends React.Component<ZoomViewProps, {}> {
    render() {
        let open = !!(this.props.viewState.selected && this.props.tools.indexOf(this.props.viewState.selected) >= 0);
        let imports = this.props.viewState.importsFromSelected ? this.props.viewState.importsFromSelected.columns : [];
        let exports = this.props.viewState.exportsToSelected ? this.props.viewState.exportsToSelected.columns : [];

        let importReport = (id: string) => {
            if (this.props.viewState.importsFromSelected) {
                return this.props.viewState.importsFromSelected.columns.find(x => x.id === id);
            }
            return null;
        };

        let exportReport = (id: string) => {
            if (this.props.viewState.exportsToSelected) {
                return this.props.viewState.exportsToSelected.columns.find(x => x.id === id);
            }
            return null;
        };

        let importLabel = (id: string): JSX.Element | null => {
            let imp = importReport(id);
            if (!imp) return null;
            return (
                <Tooltip position={Position.RIGHT} key={imp.id} content={<VersionTable report={imp} />}>
                    <div style={toolboxDivStyle(imp.summary)}>
                        {supportBox(imp.summary, imp.name, {}, () => (this.props.viewState.selected = id))}
                    </div>
                </Tooltip>
            );
        };

        let exportLabel = (id: string): JSX.Element | null => {
            let exp = exportReport(id);
            if (!exp) return null;
            return (
                <Tooltip position={Position.RIGHT} key={exp.id} content={<VersionTable report={exp} />}>
                    <div style={toolboxDivStyle(exp.summary)}>
                        {supportBox(exp.summary, exp.name, {}, () => (this.props.viewState.selected = id))}
                    </div>
                </Tooltip>
            );
        };

        let tool = this.props.viewState.selected
            ? this.props.viewState.export_tools[this.props.viewState.selected]
            : "";

        return (
            <Overlay
                className={Classes.OVERLAY_SCROLL_CONTAINER}
                isOpen={open}
                onClose={() => (this.props.viewState.selected = null)}
                lazy={true}
                transitionDuration={500}
            >
                <div style={{ width: "80%", left: "10%", right: "10%", marginTop: "10vh" }}>
                    <div style={backgrounDivStyle}>
                        <div style={rowDivStyle}>
                            <h1 style={{ textAlign: "center" }}>{tool}</h1>
                            <div style={columnDivStyle}>
                                <div style={importsFromDiv}>
                                    <h4 style={{ paddingTop: "10px" }}>{tool} imports FMUs from:</h4>
                                    <div>
                                        {imports.length === 0 && <p>No tools</p>}
                                        <ButtonStack
                                            ids={imports.map(imp => imp.id)}
                                            viewState={this.props.viewState}
                                            style={id => ({})}
                                            intent="none"
                                            justification={Justification.RaggedLeft}
                                            renderLabel={importLabel}
                                        />
                                    </div>
                                </div>
                                <div style={exportsToDiv}>
                                    <h4 style={{ paddingTop: "10px" }}>{tool} FMUs have been imported by:</h4>
                                    <div>
                                        {exports.length === 0 && <p>No tools</p>}
                                        <ButtonStack
                                            ids={exports.map(exp => exp.id)}
                                            viewState={this.props.viewState}
                                            style={id => ({})}
                                            intent="none"
                                            justification={Justification.RaggedRight}
                                            renderLabel={exportLabel}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                </div>
            </Overlay>
        );
    }
}
