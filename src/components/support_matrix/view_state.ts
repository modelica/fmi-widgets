import { observable, computed } from "mobx";
import { promisedComputed } from "computed-async-mobx";
import { MatrixReport, RowReport } from "@modelica/fmi-data";
import { QueryFunction } from "../data";

const emptyMatrix: MatrixReport = { tools: [], exporters: [], importers: [] };

export class ViewState {
    @observable selected: string | null = null;
    @observable version: string | undefined = undefined;
    @observable variant: string | undefined = undefined;
    @observable platform: string | undefined = undefined;

    matrix = promisedComputed<MatrixReport>(emptyMatrix, () => {
        return this.query(this.version, this.variant, this.platform);
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

    constructor(protected query: QueryFunction) {}
}
