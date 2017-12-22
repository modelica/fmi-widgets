import * as React from 'react';
import { observer } from 'mobx-react';
import { ColumnReport, SupportStatus } from '@modelica/fmi-data';

// TODO: Make into full blow component...?
export const supportBox = (support: SupportStatus, title: string | undefined, base?: React.CSSProperties, onClick?: () => void) => {
    let classes = ["pt-button-group", "pt-inline"];
    let style = base ? { ...base } : {};
    return (
        <div className={classes.join(" ")} style={style} >
            {title && <label className="limited" style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "5px", marginRight: "5px" }} onClick={onClick}>{title}</label>}
            < a className="pt-button pt-intent-success" style={{ flexGrow: 1 }} tabIndex={0} role="button" > {support.passed}</a>
            <a className="pt-button pt-intent-warning" style={{ flexGrow: 1 }} tabIndex={0} role="button">{support.rejected}</a>
            <a className="pt-button pt-intent-danger" style={{ flexGrow: 1 }} tabIndex={0} role="button">{support.failed}</a>
        </div >);
};

@observer
export class VersionTable extends React.Component<{ report: ColumnReport }, {}> {
    render() {
        if (this.props.report.rows.length === 0) return null;
        let rows = this.props.report.rows[0];
        return (
            <table>
                <tbody>
                    <tr>
                        <td />
                        {rows.cols.map((col, ci) => <th key={ci}>{col.version}</th>)}
                    </tr>
                    {this.props.report.rows.map((row, ri) => {
                        return (
                            <tr key={ri}>
                                <th>{row.version}</th>
                                {row.cols.map((col, ci) => {
                                    return <td key={ci}>
                                        {col.status.passed === 0 && col.status.rejected === 0 && col.status.failed === 0 ? <span>&nbsp;</span> : supportBox(col.status, undefined, { display: "flex" })}
                                    </td>;
                                })}
                            </tr>);
                    })}
                </tbody>
            </table>);
    }
}