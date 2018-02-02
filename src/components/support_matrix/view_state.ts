import { observable, computed } from "mobx";
import { promisedComputed } from "computed-async-mobx";
import { MatrixReport, RowReport } from "@modelica/fmi-data";
import { QueryFunction } from "../data";

const emptyMatrix: MatrixReport = { tools: [], exporters: [], importers: [] };

export interface Columns {
    tools: string[];
    import_only: string[];
    both: string[];
    export_only: string[];
}

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

    @computed
    get columns(): Columns {
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

        return {
            tools: ekeys,
            import_only: io,
            export_only: eo,
            both: both,
        };
    }

    constructor(protected query: QueryFunction) {}
}
