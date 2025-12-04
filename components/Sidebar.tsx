import React, { useState } from 'react';
import { Database, Table as TableIcon, Search, ChevronRight, ChevronDown, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { TableSchema } from '../types';

interface SidebarProps {
  schemas: TableSchema[];
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
  isSSL: boolean;
  onToggleSSL: () => void;
  onDisconnect?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ schemas, selectedTable, onSelectTable, isSSL, onToggleSSL, onDisconnect }) => {
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(true);

  const filteredSchemas = schemas.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="w-64 h-full bg-gray-950 border-r border-gray-800 flex flex-col text-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Database size={18} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-100">PostgreSQL</span>
          <span className="text-xs text-green-400 flex items-center gap-1">
             {isSSL ? <ShieldCheck size={10} /> : null} {isSSL ? 'SSL Encrypted' : 'Unsecured'}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tables..."
            className="w-full bg-gray-900 border border-gray-700 text-gray-300 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="flex items-center gap-1 px-4 py-2 text-gray-400 hover:text-gray-200 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="font-semibold uppercase text-xs tracking-wider">public</span>
          <span className="ml-auto text-xs bg-gray-800 px-1.5 rounded-full">{filteredSchemas.length}</span>
        </div>
        
        {expanded && (
          <div className="mt-1">
            {filteredSchemas.map(schema => (
              <button
                key={schema.name}
                onClick={() => onSelectTable(schema.name)}
                className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                  selectedTable === schema.name 
                    ? 'bg-blue-900/30 text-blue-400 border-r-2 border-blue-500' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <TableIcon size={14} />
                <span className="truncate">{schema.name}</span>
                <span className="ml-auto text-xs text-gray-600 tabular-nums">
                  {schema.rowCount >= 1000 ? `${(schema.rowCount/1000).toFixed(1)}k` : schema.rowCount}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
         <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center gap-2">
                <Settings size={14} />
                <span className="text-xs">Config</span>
            </div>
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-xs">SSL</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isSSL} onChange={onToggleSSL} />
                <div className={`w-8 h-4 rounded-full shadow-inner transition-colors ${isSSL ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                <div className={`absolute w-2 h-2 bg-white rounded-full top-1 left-1 transition-transform ${isSSL ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
         </div>

         {onDisconnect && (
             <button 
                onClick={onDisconnect}
                className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded py-1.5 text-xs transition-colors"
             >
                <LogOut size={12} /> Disconnect
             </button>
         )}
      </div>
    </div>
  );
};