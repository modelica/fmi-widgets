import { ToolDetails } from 'fmi-database';

export type SupportMatrix = { [stool: string]: { [ttool: string]: SupportSummary } };

function initSummary(): SupportSummary {
    return {
        passed: 0,
        rejected: 0,
        failed: 0,
        matrix: {
            rows: [],
            cols: [],
            submat: [],
        },
    };
}
export interface SupportSummary {
    passed: number;
    rejected: number;
    failed: number;
    matrix: VersionSupportMatrix;
}

export interface VersionSupportMatrix {
    rows: string[];
    cols: string[];
    submat: SupportSummary[][];
}

export function supportTransform(details: ToolDetails[]): SupportMatrix {
    let matrix: SupportMatrix = {};
    details.forEach((current) => {
        if (!matrix.hasOwnProperty(current.id)) {
            matrix[current.id] = {};
        }
        let crow = matrix[current.id];
        current.versions.forEach((cver) => {
            cver.importsFrom.forEach((imp) => {
                if (!crow.hasOwnProperty(imp.id)) {
                    crow[imp.id] = initSummary();
                }
                let col = crow[imp.id];
                imp.versions.forEach((iver) => {
                    col.passed = col.passed + iver.passed;
                    col.failed = col.failed + iver.failed;
                    col.rejected = col.rejected + iver.rejected;
                });
            });
            cver.exportsTo.forEach((exp) => {
                if (!crow.hasOwnProperty(exp.id)) {
                    crow[exp.id] = initSummary();
                }
                let col = crow[exp.id];
                exp.versions.forEach((ever) => {
                    col.passed = col.passed + ever.passed;
                    col.failed = col.failed + ever.failed;
                    col.rejected = col.rejected + ever.rejected;
                });
            });
        });
    });
    return matrix;
}