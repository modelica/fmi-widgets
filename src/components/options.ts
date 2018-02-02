export type SelectMap = Array<{ key: string; label: string }>;

export const fmiVersions: SelectMap = [
    { key: "", label: "All Versions" },
    { key: "FMI_1.0", label: "FMI 1.0" },
    { key: "FMI_2.0", label: "FMI 2.0" },
];

export const fmiVariants: SelectMap = [
    { key: "", label: "All Variants" },
    { key: "CoSimulation", label: "Co-Simulation" },
    { key: "ModelExchange", label: "Model Exchange" },
];

export const fmiPlatforms: SelectMap = [
    { key: "", label: "All Platforms" },
    { key: "win32", label: "Windows, 32-bit" },
    { key: "win64", label: "Windows, 64-bit" },
    { key: "linux32", label: "Linux, 32-bit" },
    { key: "linux64", label: "Linux, 64-bit" },
    { key: "darwin32", label: "macOS, 32-bit" },
    { key: "darwin64", label: "macOS, 64-bit" },
    { key: "c-code", label: "C Code" },
];
