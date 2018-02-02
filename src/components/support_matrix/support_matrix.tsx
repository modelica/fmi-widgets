import * as React from "react";
import "./support_matrix.css";
import { MatrixReport, RowReport, SupportStatus, Status } from "@modelica/fmi-data";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { promisedComputed } from "computed-async-mobx";
import { Button, Tooltip, Classes, Colors, Overlay, Position } from "@blueprintjs/core";
import { VersionTable, supportBox } from "./version_table";
import { QueryFunction } from "../data";
import { FMISpinner } from "./spinner";
import { Filter } from "./filter";

const emptyMatrix: MatrixReport = { tools: [], exporters: [], importers: [] };

function truncate(str: string): string {
    if (str.length > 12) return str.slice(0, 12) + "...";
    return str;
}

function toolboxDivStyle(support: SupportStatus) {
    if (support.passed > 3 && support.rejected === 0 && support.failed === 0)
        return { ...toolboxDiv, backgroundColor: Colors.FOREST5 };
    if (support.failed > 0 && support.rejected === 0 && support.passed === 0)
        return { ...toolboxDiv, backgroundColor: Colors.RED5 };
    return { ...toolboxDiv, backgroundColor: Colors.GRAY5 };
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
    textAlign: "end",
};

const exportsToDiv = {
    minWidth: "400px",
    width: "50%",
    paddingTop: "30x",
    paddingBottom: "20px",
    paddingLeft: "20px",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    borderLeft: "1px solid black",
};

const dashedRightBorder = {
    textAlign: "center",
    borderRight: "1px dashed black",
    paddingRight: "5px",
    marginRight: "5px",
};

const flexBasis = "auto";

const flexGrow1 = {
    flexGrow: 1,
    flexBasis: flexBasis,
};

export interface SupportMatrixProps {
    query: QueryFunction;
}

export class ViewState {}

@observer
export class SupportMatrixViewer extends React.Component<SupportMatrixProps, {}> {
    @observable selected: string | null = null;
    @observable version: string | undefined = undefined;
    @observable variant: string | undefined = undefined;
    @observable platform: string | undefined = undefined;
    matrix = promisedComputed<MatrixReport>(emptyMatrix, () => {
        return this.props.query(this.version, this.variant, this.platform);
    });
    @computed
    get loading() {
        return this.matrix.busy;
    }
    @computed
    get export_tools(): { [id: string]: string } {
        let ret = {};
        this.matrix.get().importers.forEach(exp => {
            ret[exp.id] = exp.name;
            exp.columns.forEach(imp => {
                ret[imp.id] = imp.name;
            });
        });
        return ret;
    }
    @computed
    get import_tools(): { [id: string]: string } {
        let ret = {};
        this.matrix.get().importers.forEach(exp => {
            ret[exp.id] = exp.name;
            exp.columns.forEach(imp => {
                ret[imp.id] = imp.name;
            });
        });
        return ret;
    }
    @computed
    get exportsTo(): RowReport | null {
        if (this.selected == null) return null;

        for (let i = 0; i < this.matrix.get().importers.length; i++) {
            if (this.matrix.get().importers[i].id === this.selected) return this.matrix.get().importers[i];
        }
        // Happens if tool doesn't support export
        return null;
    }
    @computed
    get importsFrom(): RowReport | null {
        if (this.selected == null) return null;

        for (let i = 0; i < this.matrix.get().importers.length; i++) {
            if (this.matrix.get().importers[i].id === this.selected) return this.matrix.get().importers[i];
        }
        // Happens if tool doesn't export
        return null;
    }

    supportLevel(tool: string, exp: boolean): Status {
        // If cross-check data...green
        let mat = this.matrix.get();

        if (exp) {
            for (let i = 0; i < mat.exporters.length; i++) {
                let exporter = mat.exporters[i];
                if (exporter.id === tool) {
                    if (exporter.columns.length > 0) return Status.CrossChecked;
                    return exporter.best;
                }
            }
            return Status.Unsupported;
        } else {
            for (let i = 0; i < mat.importers.length; i++) {
                let importer = mat.importers[i];
                if (importer.id === tool) {
                    if (importer.columns.length > 0) return Status.CrossChecked;
                    return importer.best;
                }
            }
            return Status.Unsupported;
        }
    }

    supportColor(support: Status): string {
        switch (support) {
            case Status.Available:
                return Colors.ORANGE5;
            case Status.CrossChecked:
                return Colors.FOREST5;
            default:
                return Colors.GRAY5;
        }
    }

    constructor(props?: SupportMatrixProps, context?: {}) {
        super(props, context);
    }
    render() {
        let leftArrow = (id: string) => {
            let exports = this.matrix.get().exporters.some(exp => exp.id === id);
            let imports = this.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === id));
            if (imports && !exports) return <span className="pt-icon-arrow-right" />;
            return null;
        };
        let rightArrow = (id: string) => {
            let exports = this.matrix.get().exporters.some(exp => exp.id === id);
            let imports = this.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === id));
            if (imports && exports) return <span className="pt-icon-arrows-horizontal" />;
            if (imports) return null;
            if (exports) return <span className="pt-icon-arrow-right" />;
            return <span className="pt-icon-ban-circle" />;
        };

        let ekeys = Object.keys(this.export_tools);
        let io: string[] = [];
        let eo: string[] = [];
        let both: string[] = [];

        ekeys.forEach(key => {
            let exports = this.matrix.get().exporters.some(exp => exp.id === key);
            let imports = this.matrix.get().exporters.some(exp => exp.columns.some(imp => imp.id === key));
            if (imports && exports) both.push(key);
            if (imports && !exports) io.push(key);
            if (exports && !imports) eo.push(key);
        });

        this.matrix.get().tools.forEach(tool => {
            if (io.indexOf(tool) === -1 && eo.indexOf(tool) === -1 && both.indexOf(tool) === -1) {
                console.log("Tool " + tool + " provides no cross-check data");
            }
        });

        return (
            <div className="Support" style={{ margin: "10px" }}>
                <Filter settings={this} />
                {/* Show spinner if the data hasn't loaded yet */}
                {this.loading && FMISpinner}
                {!this.loading && ekeys.length === 0 && <p>No tools match your filter parameters</p>}
                {!this.loading &&
                    ekeys.length > 0 && (
                        <div>
                            <p>Select a tool to find out more about its FMI capabilities...</p>
                            <div style={{ display: "flex", marginBottom: "30px" }}>
                                <div style={{ ...flexGrow1, ...dashedRightBorder }}>
                                    <h4>Import only</h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                        {io.map((id, ti) => {
                                            return (
                                                <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                                                    <Button
                                                        className="pt-small"
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: this.supportColor(
                                                                this.supportLevel(id, false),
                                                            ),
                                                        }}
                                                        active={this.selected === id}
                                                        onClick={() => (this.selected = id)}
                                                    >
                                                        <small>{leftArrow(id)}</small>&nbsp;
                                                        <span>{truncate(this.export_tools[id])}</span>
                                                        &nbsp;<small>{rightArrow(id)}</small>
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ ...flexGrow1, textAlign: "center" }}>
                                    <h4>Import and Export</h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                        {both.map((id, ti) => {
                                            return (
                                                <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                                                    <Button
                                                        className="pt-small"
                                                        style={{ width: "100%", backgroundColor: Colors.FOREST5 }}
                                                        active={this.selected === id}
                                                        onClick={() => (this.selected = id)}
                                                    >
                                                        <small>{leftArrow(id)}</small>&nbsp;
                                                        <span>{truncate(this.export_tools[id])}</span>
                                                        &nbsp;<small>{rightArrow(id)}</small>
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ ...flexGrow1, ...dashedRightBorder }}>
                                    <h4>Export only</h4>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                        {eo.map((id, ti) => {
                                            return (
                                                <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                                                    <Button
                                                        className="pt-small"
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: this.supportColor(
                                                                this.supportLevel(id, true),
                                                            ),
                                                        }}
                                                        active={this.selected === id}
                                                        onClick={() => (this.selected = id)}
                                                    >
                                                        <small>{leftArrow(id)}</small>&nbsp;
                                                        <span>{truncate(this.export_tools[id])}</span>
                                                        &nbsp;<small>{rightArrow(id)}</small>
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <Overlay
                                className={Classes.OVERLAY_SCROLL_CONTAINER}
                                isOpen={!!(this.selected && ekeys.indexOf(this.selected) >= 0)}
                                onClose={() => (this.selected = null)}
                                lazy={true}
                                transitionDuration={500}
                            >
                                <div style={{ width: "80%", left: "10%", right: "10%", marginTop: "10vh" }}>
                                    {this.selected &&
                                        ekeys.indexOf(this.selected) >= 0 && (
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
                                                            {this.importsFrom &&
                                                                this.importsFrom.columns.length === 0 && (
                                                                    <p>
                                                                        No tools import from{" "}
                                                                        {this.export_tools[this.selected]}
                                                                    </p>
                                                                )}
                                                            {this.importsFrom &&
                                                                this.importsFrom.columns.map(imp => {
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
                                                                                    () => (this.selected = imp.id),
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
                                                            &nbsp;<span
                                                                style={{ height: "1.5em", verticalAlign: "top" }}
                                                            >
                                                                {truncate(this.export_tools[this.selected])}
                                                            </span>&nbsp;
                                                            <span className="pt-icon-arrow-right" />
                                                        </h2>
                                                    </div>
                                                    <div style={exportsToDiv}>
                                                        <h4 style={{ paddingTop: "10px" }}>Exports To:</h4>
                                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                            {this.exportsTo &&
                                                                this.exportsTo.columns.length === 0 && (
                                                                    <p>
                                                                        No tools export to{" "}
                                                                        {this.export_tools[this.selected]}
                                                                    </p>
                                                                )}
                                                            {this.exportsTo &&
                                                                this.exportsTo.columns.map(exp => {
                                                                    return (
                                                                        <Tooltip
                                                                            position={Position.LEFT}
                                                                            key={exp.id}
                                                                            content={<VersionTable report={exp} />}
                                                                        >
                                                                            <div
                                                                                key={exp.id}
                                                                                style={toolboxDivStyle(exp.summary)}
                                                                            >
                                                                                {supportBox(
                                                                                    exp.summary,
                                                                                    exp.name,
                                                                                    {},
                                                                                    () => (this.selected = exp.id),
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

                            {/* <SupportGraph matrix={this.matrix.get()} /> */}
                        </div>
                    )}
            </div>
        );
    }
}
