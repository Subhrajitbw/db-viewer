import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DataGrid } from './components/DataGrid';
import { QueryEditor } from './components/QueryEditor';
import { ERDViewer } from './components/ERDViewer';
import { ConnectionForm } from './components/ConnectionForm';
import { getSchemas, executeQuery, getTableData, connectDB } from './services/mockDb';
import { TableSchema, ViewMode, QueryResult, ConnectionDetails } from './types';
import { Database, Code, Network } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewMode>(ViewMode.DATA);
  const [data, setData] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSSL, setIsSSL] = useState(true);

  const handleConnect = async (details: ConnectionDetails) => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      await connectDB(details);
      // Fetch Schemas after successful connection
      const s = await getSchemas();
      setSchemas(s);
      setIsConnected(true);
      setIsSSL(details.ssl);
      
      // Auto select first table
      if (s.length > 0) {
        setSelectedTable(s[0].name);
        loadTableData(s[0].name);
      }
    } catch (err: any) {
        setConnectionError(err.message || "Failed to connect to database");
    } finally {
        setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSchemas([]);
    setData(null);
    setSelectedTable(null);
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const result = await getTableData(tableName, 0, 100);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    if (activeTab === ViewMode.DATA) {
      loadTableData(tableName);
    }
  };

  const handleExecuteQuery = async (sql: string) => {
    setLoading(true);
    try {
      const result = await executeQuery(sql);
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return <ConnectionForm onConnect={handleConnect} loading={isConnecting} error={connectionError} />;
  }

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        schemas={schemas} 
        selectedTable={selectedTable} 
        onSelectTable={handleTableSelect} 
        isSSL={isSSL}
        onToggleSSL={() => setIsSSL(!isSSL)}
        onDisconnect={handleDisconnect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Tabs */}
        <div className="h-12 border-b border-gray-800 bg-gray-950 flex items-center px-4 gap-4">
          <button 
            onClick={() => { setActiveTab(ViewMode.DATA); if(selectedTable) loadTableData(selectedTable); }}
            className={clsx(
              "flex items-center gap-2 h-full border-b-2 px-2 transition-colors text-sm font-medium",
              activeTab === ViewMode.DATA ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <Database size={16} /> Data
          </button>
          <button 
             onClick={() => setActiveTab(ViewMode.QUERY)}
             className={clsx(
              "flex items-center gap-2 h-full border-b-2 px-2 transition-colors text-sm font-medium",
              activeTab === ViewMode.QUERY ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <Code size={16} /> Query
          </button>
          <button 
             onClick={() => setActiveTab(ViewMode.ERD)}
             className={clsx(
              "flex items-center gap-2 h-full border-b-2 px-2 transition-colors text-sm font-medium",
              activeTab === ViewMode.ERD ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <Network size={16} /> ER Diagram
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 relative overflow-hidden">
          
          {activeTab === ViewMode.DATA && (
            <DataGrid data={data} loading={loading} />
          )}

          {activeTab === ViewMode.QUERY && (
             <div className="h-full flex flex-col">
                <div className="h-1/2 border-b border-gray-800">
                    <QueryEditor onExecute={handleExecuteQuery} isExecuting={loading} />
                </div>
                <div className="h-1/2 flex flex-col">
                   <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400 font-bold uppercase tracking-wider">Results</div>
                   <DataGrid data={data} loading={loading} />
                </div>
             </div>
          )}

          {activeTab === ViewMode.ERD && (
             <ERDViewer schemas={schemas} />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;