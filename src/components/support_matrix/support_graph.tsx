import { MatrixReport } from '@modelica/fmi-data';
import { observer } from 'mobx-react';
import * as React from 'react';

var Graph = require('react-graph-vis').default;

type NodeType = { id: string | number, label: string, title?: string };
type EdgeType = { from: string | number, to: string | number };

@observer
export class SupportGraph extends React.Component<{ matrix: MatrixReport }, {}> {
    graph: { nodes: NodeType[], edges: EdgeType[] } = {
        nodes: [
        ],
        edges: [
        ]
    };
    options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        interaction: {
            hideEdgesOnDrag: true,
            tooltipDelay: 200
        },
    };

    constructor(props?: { matrix: MatrixReport }, context?: {}) {
        super(props, context);
        this.props.matrix.importers.forEach((row, ri) => {
            this.graph.nodes.push({
                id: row.id,
                label: ri.toFixed(0),
                title: row.name,
            });
            row.columns.forEach((col) => {
                this.graph.edges.push({
                    from: row.id,
                    to: col.id,
                });
            });
        });
    }

    render() {
        return (
            <div>
                <div style={{ width: "500px", height: "500px", border: "1px solid blue" }}>
                    <Graph graph={this.graph} options={this.options} />
                </div>
            </div>
        );
    }
}
