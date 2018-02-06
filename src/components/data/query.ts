import { MatrixReport, ToolsTable } from "@modelica/fmi-data";

export interface QueryResult {
    tools: ToolsTable;
    matrix: MatrixReport;
}

export type QueryFunction = (
    version: string | undefined,
    variant: string | undefined,
    platform: string | undefined,
) => Promise<QueryResult>;
