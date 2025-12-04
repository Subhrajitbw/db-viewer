import React, { useState } from 'react';
import { Database, Shield, Zap, Lock } from 'lucide-react';
import { ConnectionDetails } from '../types';

interface ConnectionFormProps {
  onConnect: (details: ConnectionDetails) => void;
  loading: boolean;
  error: string | null;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({ onConnect, loading, error }) => {
  const [formData, setFormData] = useState({
    host: '',
    port: '5432',
    database: '',
    user: '',
    password: '',
    ssl: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(formData);
  };

  const handleDemo = () => {
    onConnect({ ssl: true, isDemo: true });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#161b22] rounded-xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Left Side: Branding */}
        <div className="p-8 bg-gradient-to-br from-blue-900/40 to-gray-900 flex flex-col justify-between border-r border-gray-800">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Database size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">OmniDB Viewer</h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A secure, frontend-first database client for PostgreSQL. Visualize your schema, query data, and analyze relationships without installing native apps.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Shield size={16} className="text-green-400" />
                <span>Zero-knowledge client</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Zap size={16} className="text-yellow-400" />
                <span>Virtualized performance</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Lock size={16} className="text-blue-400" />
                <span>SSL/TLS Encrypted</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-xs text-gray-500">
              * This is a client-side application. Your credentials are used to establish a session and are never stored on our servers.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Connect to Database</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-medium text-gray-400">Host</label>
                <input
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="db.example.com"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Port</label>
                <input
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="5432"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Database Name</label>
              <input
                name="database"
                value={formData.database}
                onChange={handleChange}
                placeholder="production_db"
                className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">User</label>
                <input
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="postgres"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="ssl"
                id="ssl"
                checked={formData.ssl}
                onChange={handleChange}
                className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="ssl" className="text-xs text-gray-400 cursor-pointer select-none">Enable SSL Connection (Recommended)</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                'Connect Database'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#161b22] text-gray-500">Or try without an account</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            type="button"
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium py-2 rounded transition-all text-sm"
          >
            Load Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};