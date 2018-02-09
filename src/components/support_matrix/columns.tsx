import * as React from "react";
import { flexGrow1, dashedRightBorder } from "./style";
import { observer } from "mobx-react";

export interface ColumnsProps {
    children: React.ReactElement<{}>[];
    style?: React.CSSProperties;
}

@observer
export class Columns extends React.Component<ColumnsProps, {}> {
    render() {
        let maxWidth = Math.floor(100 / Math.max(2, this.props.children.length) * 1.1) + "%";
        return (
            <div style={{ display: "flex", marginBottom: "30px", ...this.props.style }}>
                {this.props.children &&
                    this.props.children.map((child, i) => (
                        <div
                            key={i}
                            style={{
                                ...flexGrow1,
                                textAlign: "center",
                                maxWidth: maxWidth,
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
