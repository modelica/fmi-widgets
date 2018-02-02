export type SelectMap = Array<{ key: string; label: string }>;
import { FMIVersion, FMIVariant, FMIPlatform } from "@modelica/fmi-data";

export const fmiVersions: SelectMap = [
    { key: "", label: "All Versions" },
    { key: FMIVersion.FMI1, label: "FMI 1.0" },
    { key: FMIVersion.FMI2, label: "FMI 2.0" },
];

export const fmiVariants: SelectMap = [
    { key: "", label: "All Variants" },
    { key: FMIVariant.CS, label: "Co-Simulation" },
    { key: FMIVariant.ME, label: "Model Exchange" },
];

export const fmiPlatforms: SelectMap = [
    { key: "", label: "All Platforms" },
    { key: FMIPlatform.Win32, label: "Windows, 32-bit" },
    { key: FMIPlatform.Win64, label: "Windows, 64-bit" },
    { key: FMIPlatform.Linux32, label: "Linux, 32-bit" },
    { key: FMIPlatform.Linux64, label: "Linux, 64-bit" },
    { key: FMIPlatform.Darwin32, label: "macOS, 32-bit" },
    { key: FMIPlatform.Darwin64, label: "macOS, 64-bit" },
    { key: FMIPlatform.Code, label: "C Code" },
];
