import { MatrixReport, ToolsTable, CrossCheckTable } from "@modelica/fmi-data";

export interface QueryResult {
    tools: ToolsTable;
    xc_results: CrossCheckTable;
    matrix: MatrixReport;
}

export type QueryFunction = (
    version: string | undefined,
    variant: string | undefined,
    platform: string | undefined,
) => Promise<QueryResult>;
