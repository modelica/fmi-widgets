import { observable, computed } from "mobx";
import { promisedComputed } from "computed-async-mobx";
import { MatrixReport, RowReport } from "@modelica/fmi-data";
import { QueryFunction, QueryResult } from "../data";

const emptyMatrix: MatrixReport = { tools: [], exporters: [], importers: [] };

export interface SupportLevels {
    tested: string[];
    available: string[];
    planned: string[];
}

export interface Columns {
    tools: string[];
    import_only: string[];
    both: string[];
    export_only: string[];
}

/**
 * The ViewState class encapsulates the current status of the query subject
 * to filtering on FMI version, variant and platform.
 *
 * TODO: Write some tests to test the logic in these @computed properties
 */
export class ViewState {
    /** Currently selected tool */
    @observable selected: string | null = null;
    /** Version of FMI to filter on (if any) */
    @observable version: string | undefined = undefined;
    /** Variant of FMI to filter on (if any) */
    @observable variant: string | undefined = undefined;
    /** Platform to filter on (if any) */
    @observable platform: string | undefined = undefined;

    /** The MatrixReport instance for the given filter parameters */
    // matrix = promisedComputed<MatrixReport>(emptyMatrix, () => {
    //     return this.query(this.version, this.variant, this.platform);
    // });

    results = promisedComputed<QueryResult>({ matrix: emptyMatrix, tools: [], xc_results: [] }, () => {
        return this.query(this.version, this.variant, this.platform);
    });

    @computed
    get matrix() {
        return this.results.get().matrix;
    }

    /** A flag indicating whether we are waiting for the matrix report */
    @computed
    get loading() {
        return this.results.busy;
    }

    /**
     * Map of tool ids to tool names for tools that exported FMUs that were
     * subsequently imported (subject to filter settings)
     */
    @computed
    get export_tools(): { [id: string]: string } {
        let ret = {};
        this.matrix.importers.forEach(exp => {
            ret[exp.id] = exp.name;
            exp.columns.forEach(imp => {
                ret[imp.id] = imp.name;
            });
        });
        return ret;
    }

    /**
     * Map of tool ids that improted FMUs (subject to filter settings)
     */
    @computed
    get import_tools(): { [id: string]: string } {
        let ret = {};
        this.matrix.importers.forEach(exp => {
            ret[exp.id] = exp.name;
            exp.columns.forEach(imp => {
                ret[imp.id] = imp.name;
            });
        });
        return ret;
    }

    /** List of all tools that exported FMUs that were imported from the current tool */
    @computed
    get exportsToSelected(): RowReport | null {
        if (this.selected == null) return null;

        for (let i = 0; i < this.matrix.importers.length; i++) {
            if (this.matrix.importers[i].id === this.selected) return this.matrix.importers[i];
        }
        // Happens if tool doesn't support export
        return null;
    }

    /** List of all tools that imported FMUs that were exported by the current tool */
    @computed
    get importsFromSelected(): RowReport | null {
        if (this.selected == null) return null;

        for (let i = 0; i < this.matrix.importers.length; i++) {
            if (this.matrix.importers[i].id === this.selected) return this.matrix.importers[i];
        }
        // Happens if tool doesn't export
        return null;
    }

    /**
     * This computes which tools belong in the three categories:
     *   * Export only
     *   * Import and Export (both)
     *   * Import only
     */
    @computed
    get columns(): Columns {
        // TODO: Shouldn't this be all tools?
        let ekeys = Object.keys(this.export_tools);
        let importOnly: string[] = [];
        let exportOnly: string[] = [];
        let both: string[] = [];

        ekeys.forEach(key => {
            let exports = this.matrix.exporters.some(exp => exp.id === key);
            let imports = this.matrix.exporters.some(exp => exp.columns.some(imp => imp.id === key));
            if (imports && exports) both.push(key);
            if (imports && !exports) importOnly.push(key);
            if (exports && !imports) exportOnly.push(key);
        });

        return {
            tools: ekeys,
            import_only: importOnly,
            export_only: exportOnly,
            both: both,
        };
    }

    constructor(protected query: QueryFunction) {}
}
