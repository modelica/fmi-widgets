import * as React from "react";
import { Spinner, Classes, Intent } from "@blueprintjs/core";

export const FMISpinner = (
    <div style={{ margin: "10px" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
            <div style={{ flexGrid: 1 }}>
                <Spinner className={"big-spinner " + Classes.LARGE} intent={Intent.SUCCESS} />
            </div>
        </div>
    </div>
);
