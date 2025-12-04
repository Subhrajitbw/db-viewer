import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { QueryResult } from '../types';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

interface DataGridProps {
  data: QueryResult | null;
  loading: boolean;
}

export const DataGrid: React.FC<DataGridProps> = ({ data, loading }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.rows.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimated row height
    overscan: 5,
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Fetching records...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
        <p>Select a table or run a query to view data.</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="bg-red-900/20 border border-red-800 p-6 rounded-lg max-w-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-red-400 font-bold mb-2">Query Error</h3>
            <p className="text-red-300 text-sm">{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
      {/* Metrics Bar */}
      <div className="bg-gray-800 px-4 py-1 flex items-center justify-between text-xs text-gray-400 border-b border-gray-700">
        <div>
           {data.rows.length} rows retrieved
        </div>
        <div>
           Execution: <span className="text-gray-300 font-mono">{data.executionTimeMs}ms</span>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="w-12 flex-shrink-0 p-2 border-r border-gray-700 text-center text-gray-500 font-mono text-xs">#</div>
        {data.columns.map((col, idx) => (
          <div key={idx} className="flex-1 p-2 border-r border-gray-700 font-semibold text-gray-300 text-sm flex items-center justify-between min-w-[150px]">
            <span className="truncate">{col}</span>
            <ArrowUpDown size={12} className="text-gray-600 hover:text-gray-400 cursor-pointer" />
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div 
        ref={parentRef} 
        className="flex-1 overflow-auto"
        style={{ height: '100%' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data.rows[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                className={`absolute top-0 left-0 w-full flex border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${virtualRow.index % 2 === 0 ? 'bg-gray-900' : 'bg-[#11161d]'}`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="w-12 flex-shrink-0 p-2 border-r border-gray-800 text-center text-gray-600 font-mono text-xs truncate">
                  {virtualRow.index + 1}
                </div>
                {row.map((cell: any, cellIdx: number) => (
                  <div key={cellIdx} className="flex-1 p-2 border-r border-gray-800 text-gray-300 text-sm truncate font-mono min-w-[150px] flex items-center">
                    {cell !== null ? String(cell) : <span className="text-gray-600 italic">NULL</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
