import { MatrixReport } from "@modelica/fmi-data";

const versionKey = "version";
const variantKey = "variant";
const platformKey = "platform";

// NB - This code is old and needs to be upgraded to return a QueryResult instead of a MatrixReport (if
// we ever decide to use it)
export async function queryServer(
    version: string | undefined,
    variant: string | undefined,
    platform: string | undefined,
): Promise<MatrixReport> {
    console.log("Loading data by querying server");
    let qs: { [key: string]: string } = {};
    if (version) qs[versionKey] = version;
    if (variant) qs[variantKey] = variant;
    if (platform) qs[platformKey] = platform;

    let headers = new Headers({
        Accept: "application/json",
    });
    headers.set("Accept", "application/json");

    let qsstr = Object.keys(qs)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(qs[k]))
        .join("&");

    let req = new Request(`http://localhost:4000/report/matrix?${qsstr}`, {
        method: "GET",
        headers: headers,
    });
    let resp = await fetch(req);
    return resp.json();
}
