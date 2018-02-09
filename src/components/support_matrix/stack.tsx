import * as React from "react";
import { ViewState } from "../state";
import { Button } from "@blueprintjs/core";
import { observer } from "mobx-react";

export enum Justification {
    RaggedLeft,
    Block,
    RaggedRight,
}

export interface ButtonStackProps {
    ids: string[];
    viewState: ViewState;
    buttonStyle: (id: string) => React.CSSProperties;
    style?: React.CSSProperties;
    renderLabel: (id: string) => JSX.Element | null;
    justification: Justification;
    intent?: string;
}

@observer
export class ButtonStack extends React.Component<ButtonStackProps, {}> {
    render() {
        let justify: "space-between" | "flex-start" | "flex-end";
        let flexGrow = this.props.justification === Justification.Block ? 1 : 0;
        let intent = this.props.intent ? `pt-intent-${this.props.intent}` : "";
        switch (this.props.justification) {
            case Justification.RaggedLeft:
                justify = "flex-end";
                break;
            case Justification.RaggedRight:
                justify = "flex-start";
                break;
            default:
                justify = "space-between";
                break;
        }
        return (
            <div style={{ ...this.props.style, display: "flex", flexWrap: "wrap", justifyContent: justify }}>
                {this.props.ids.map((id, ti) => {
                    return (
                        <div key={id} style={{ margin: 2, flexGrow: flexGrow, textAlign: "center" }}>
                            <Button
                                className={"pt-small " + intent}
                                style={{
                                    width: "100%",
                                    ...this.props.buttonStyle(id),
                                }}
                                active={this.props.viewState.selected === id}
                                onClick={() => (this.props.viewState.selected = id)}
                            >
                                {this.props.renderLabel(id)}
                            </Button>
                        </div>
                    );
                })}
            </div>
        );
    }
}
