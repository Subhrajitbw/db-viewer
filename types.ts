export interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface TableSchema {
  name: string;
  columns: Column[];
  rowCount: number;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export enum ViewMode {
  DATA = 'DATA',
  QUERY = 'QUERY',
  ERD = 'ERD',
}

export interface DbState {
  isConnected: boolean;
  schemas: TableSchema[];
}

export interface ConnectionDetails {
  host?: string;
  port?: string;
  database?: string;
  user?: string;
  password?: string;
  ssl: boolean;
  isDemo?: boolean;
}