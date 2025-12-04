import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position, 
  Node, 
  Edge,
  MarkerType
} from 'reactflow';
import { TableSchema } from '../types';
import { Key, Unlink } from 'lucide-react';

interface ERDViewerProps {
  schemas: TableSchema[];
}

// Custom Node Component for Table
const TableNode = ({ data }: { data: TableSchema }) => {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-md min-w-[220px] shadow-xl overflow-hidden">
      <div className="bg-gray-700 px-3 py-2 font-bold text-gray-100 text-sm flex items-center justify-between border-b border-gray-600">
         {data.name}
         <span className="text-[10px] bg-gray-600 px-1.5 rounded text-gray-300">{data.rowCount} rows</span>
      </div>
      <div className="p-2">
        {data.columns.map((col, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 text-gray-300 relative group">
             {/* Handles for connections */}
             <Handle type="target" position={Position.Left} id={`${data.name}-${col.name}-target`} className="!w-2 !h-2 !bg-gray-500 !border-none" style={{ left: -10 }} />
             
            <div className="flex items-center gap-2">
                {col.isPrimaryKey && <Key size={10} className="text-yellow-500" />}
                {col.isForeignKey && <Unlink size={10} className="text-blue-400" />}
                <span className={col.isPrimaryKey ? 'font-bold text-white' : ''}>{col.name}</span>
            </div>
            <span className="text-gray-500 font-mono text-[10px]">{col.type}</span>

            <Handle type="source" position={Position.Right} id={`${data.name}-${col.name}-source`} className="!w-2 !h-2 !bg-blue-500 !border-none" style={{ right: -10 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = {
  table: TableNode,
};

export const ERDViewer: React.FC<ERDViewerProps> = ({ schemas }) => {
  
  // Transform schemas into React Flow Nodes
  const nodes: Node[] = useMemo(() => {
    return schemas.map((schema, index) => {
        // Simple layout logic: Grid layout
        const colCount = 3;
        const x = (index % colCount) * 350;
        const y = Math.floor(index / colCount) * 300;

        return {
            id: schema.name,
            type: 'table',
            position: { x: x + 50, y: y + 50 },
            data: schema,
        };
    });
  }, [schemas]);

  // Transform relationships into React Flow Edges
  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];
    schemas.forEach(schema => {
        schema.columns.forEach(col => {
            if (col.isForeignKey && col.references) {
                edgeList.push({
                    id: `e-${schema.name}-${col.name}-${col.references.table}`,
                    source: col.references.table,
                    sourceHandle: `${col.references.table}-${col.references.column}-source`,
                    target: schema.name,
                    targetHandle: `${schema.name}-${col.name}-target`,
                    animated: true,
                    style: { stroke: '#60a5fa', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#60a5fa' },
                });
            }
        });
    });
    return edgeList;
  }, [schemas]);

  return (
    <div className="w-full h-full bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="bg-gray-950"
      >
        <Background color="#374151" gap={20} size={1} />
        <Controls className="bg-gray-800 border-gray-700 text-white fill-white" />
      </ReactFlow>
    </div>
  );
};