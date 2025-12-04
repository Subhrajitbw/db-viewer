import React, { useState, useEffect } from 'react';
import { Play, Download, Eraser, Command } from 'lucide-react';

interface QueryEditorProps {
  onExecute: (query: string) => void;
  isExecuting: boolean;
}

export const QueryEditor: React.FC<QueryEditorProps> = ({ onExecute, isExecuting }) => {
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 100;");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onExecute(query);
    }
  };

  const handleExport = () => {
    // Mock export function
    alert("Exporting current result set to CSV...");
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4 justify-between bg-gray-900">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => onExecute(query)}
                disabled={isExecuting}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play size={14} fill="currentColor" />
                Run
            </button>
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline-block">Ctrl + Enter to run</span>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
                title="Clear"
            >
                <Eraser size={16} />
            </button>
            <button 
                onClick={handleExport}
                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors"
                title="Export CSV"
            >
                <Download size={16} />
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative font-mono text-sm group">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-[#0d1117] text-gray-100 p-4 resize-none focus:outline-none focus:ring-0 leading-relaxed"
          spellCheck={false}
          placeholder="Enter your SQL query here..."
        />
        
        {/* Simple keyword highlighter overlay could go here, strictly using textarea for robustness in this snippet */}
      </div>
      
      {/* Footer Info */}
      <div className="h-8 bg-gray-950 border-t border-gray-800 flex items-center px-4 text-xs text-gray-500 justify-between">
         <span>Ln {query.split('\n').length}, Col {query.length}</span>
         <span className="flex items-center gap-1"><Command size={10} /> Read-Only Mode</span>
      </div>
    </div>
  );
};