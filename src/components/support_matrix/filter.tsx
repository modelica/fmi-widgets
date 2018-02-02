import * as React from "react";
import { fmiVersions, fmiVariants, fmiPlatforms } from "../options";
import { Selection } from "./selection";

export interface FilterSettings {
    settings: { version: string | undefined; variant: string | undefined; platform: string | undefined };
}

export class Filter extends React.Component<FilterSettings, {}> {
    render() {
        let settings = this.props.settings;
        return (
            <div style={{ display: "flex" }}>
                <Selection
                    label="FMI Version"
                    onChange={v => (settings.version = v)}
                    currentKey={settings.version}
                    options={fmiVersions}
                />
                <Selection
                    label="Variant"
                    onChange={v => (settings.variant = v)}
                    currentKey={settings.variant}
                    options={fmiVariants}
                />
                <Selection
                    label="Platform"
                    onChange={v => (settings.platform = v)}
                    currentKey={settings.platform}
                    options={fmiPlatforms}
                />
            </div>
        );
    }
}
