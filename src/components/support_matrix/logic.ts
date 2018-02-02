import { Status } from "@modelica/fmi-data";
import { ViewState } from "./view_state";
import { Colors } from "@blueprintjs/core";

export function supportLevel(state: ViewState, tool: string, exp: boolean): Status {
    // If cross-check data...green
    let mat = state.matrix.get();

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

export function supportColor(support: Status): string {
    switch (support) {
        case Status.Available:
            return Colors.ORANGE5;
        case Status.CrossChecked:
            return Colors.FOREST5;
        default:
            return Colors.GRAY5;
    }
}
