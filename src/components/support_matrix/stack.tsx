import * as React from "react";
import { ViewState } from "./view_state";
import { Button } from "@blueprintjs/core";
import { observer } from "mobx-react";

export interface ButtonStackProps {
    ids: string[];
    viewState: ViewState;
    style: (id: string) => React.CSSProperties;
    renderLabel: (id: string) => JSX.Element;
}

@observer
export class ButtonStack extends React.Component<ButtonStackProps, {}> {
    render() {
        return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                {this.props.ids.map((id, ti) => {
                    return (
                        <div key={id} style={{ margin: 2, flexGrow: 1, textAlign: "center" }}>
                            <Button
                                className="pt-small"
                                style={{
                                    width: "100%",
                                    ...this.props.style(id),
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
