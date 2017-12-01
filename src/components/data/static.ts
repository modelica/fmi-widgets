import { MatrixReport, ToolsTable, CrossCheckResult, createMatrixReport } from '@modelica/fmi-data';
import { QueryFunction } from './query';

const versionKey = "version";
const variantKey = "variant";
const platformKey = "platform";

// For testing, you can use the GitHub raw links...
const toolsURI = "https://raw.githubusercontent.com/modelica/fmi-standard.org/master/_data/tools.json";
// const fmusURI = "https://raw.githubusercontent.com/modelica/fmi-standard.org/master/_data/fmus.json";
const xcURI = "https://raw.githubusercontent.com/modelica/fmi-standard.org/master/_data/xc_results.json";

// For production, we should use data pushed to the FMI web site.

async function fetchJSON<T extends {}>(uri: string): Promise<T> {
    let headers = new Headers({
        "Accept": "application/json",
    });
    headers.set("Accept", "application/json");

    let req = new Request(uri, {
        method: "GET",
        headers: headers,
    });
    let resp = await fetch(req);
    return resp.json();
}
export function loadData(): QueryFunction {
    let tools = fetchJSON<ToolsTable>(toolsURI);
    let results = fetchJSON<CrossCheckResult[]>(xcURI);
    // fetch data
    return async (version: string | undefined, variant: string | undefined, platform: string | undefined): Promise<MatrixReport> => {
        return createMatrixReport(await tools, await results, { version: version, variant: variant, platform: platform });
    };
}
export async function createMatrix(version: string | undefined, variant: string | undefined, platform: string | undefined): Promise<MatrixReport> {
    let qs: { [key: string]: string } = {};
    if (version) qs[versionKey] = version;
    if (variant) qs[variantKey] = variant;
    if (platform) qs[platformKey] = platform;

    let headers = new Headers({
        "Accept": "application/json",
    });
    headers.set("Accept", "application/json");

    let qsstr = Object.keys(qs).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(qs[k])).join("&");

    let req = new Request(`http://localhost:4000/report/matrix?${qsstr}`, {
        method: "GET",
        headers: headers,
    });
    let resp = await fetch(req);
    return resp.json();
}
