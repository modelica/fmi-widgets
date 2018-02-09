import { SupportStatus } from "@modelica/fmi-data";
import { Colors } from "@blueprintjs/core";

export function toolboxDivStyle(support: SupportStatus) {
    if (support.passed > 3 && support.rejected === 0 && support.failed === 0)
        return { ...toolboxDiv, backgroundColor: Colors.FOREST5 };
    if (support.failed > 0 && support.rejected === 0 && support.passed === 0)
        return { ...toolboxDiv, backgroundColor: Colors.RED5 };
    return { ...toolboxDiv, backgroundColor: Colors.GRAY5 };
}

export const toolboxDiv = {
    textAlign: "center",
    padding: "4px",
    borderRadius: "6px",
    border: "1px solid #cccccc",
    margin: "2px",
    backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
    color: "#182026",
};

export const importsFromDiv = {
    minWidth: "400px",
    paddingTop: "30x",
    paddintBottom: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    textAlign: "start",
};

export const exportsToDiv = {
    minWidth: "400px",
    paddingTop: "30x",
    paddingBottom: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    textAlign: "end",
};

export const dashedRightBorder = {
    textAlign: "center",
    borderRight: "1px dashed black",
    paddingRight: "5px",
    marginRight: "5px",
};

export const flexBasis = "auto";

export const flexGrow1 = {
    flexGrow: 1,
    flexBasis: flexBasis,
};
