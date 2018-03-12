export function truncate(str: string): string {
    if (str === undefined) {
        return "<undefined>";
    }
    if (str.length > 12) return str.slice(0, 12) + "...";
    return str;
}
