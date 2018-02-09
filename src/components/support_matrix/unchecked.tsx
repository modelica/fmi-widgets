import * as React from "react";
import { ViewState } from "../state";
import { observer } from "mobx-react";

export interface UncheckedProps {
    imports: boolean;
    viewState: ViewState;
}

function describe(level: string, intent: string, viewState: ViewState, list: string[]): JSX.Element {
    return (
        <div style={{ bottom: 0, textAlign: "left", marginBottom: "10px" }}>
            <h5>{level}</h5>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {list.map((id, i) => (
                    <a href="#" style={{ flexGrow: 1, margin: 2 }}>
                        <span
                            className={"pt-tag pt-intent-" + intent}
                            style={{ width: "100%", textAlign: "center" }}
                            key={i}
                        >
                            {id}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

@observer
export class Unchecked extends React.Component<UncheckedProps, {}> {
    render() {
        let support = this.props.imports
            ? this.props.viewState.uncheckedImporting
            : this.props.viewState.uncheckedExporting;
        return (
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ flexGrow: 1, marginTop: "20px" }} />
                {support.available.length > 0 &&
                    describe("Available", "warning", this.props.viewState, support.available)}
                {support.planned.length > 0 &&
                    describe("Planning Support", "default", this.props.viewState, support.planned)}
            </div>
        );
    }
}
