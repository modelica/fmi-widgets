import * as React from "react";
import { flexGrow1, dashedRightBorder } from "./style";
import { observer } from "mobx-react";

export interface ColumnsProps {
    children: React.ReactElement<{}>[];
}

@observer
export class Columns extends React.Component<ColumnsProps, {}> {
    render() {
        return (
            <div style={{ display: "flex", marginBottom: "30px" }}>
                {this.props.children &&
                    this.props.children.map((child, i) => (
                        <div
                            style={{
                                ...flexGrow1,
                                textAlign: "center",
                                ...(i !== this.props.children.length - 1 ? dashedRightBorder : {}),
                            }}
                        >
                            {child}
                        </div>
                    ))}
            </div>
        );
    }
}
