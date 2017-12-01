import { MatrixReport } from '@modelica/fmi-data';

export type QueryFunction = (version: string | undefined, variant: string | undefined, platform: string | undefined) => Promise<MatrixReport>;
