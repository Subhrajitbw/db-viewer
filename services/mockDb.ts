import { TableSchema, QueryResult, ConnectionDetails } from '../types';

// Mock Schema
const SCHEMAS: TableSchema[] = [
  {
    name: 'users',
    rowCount: 12500,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'email', type: 'varchar(255)' },
      { name: 'full_name', type: 'varchar(100)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'role', type: 'varchar(20)' },
      { name: 'is_active', type: 'boolean' },
    ],
  },
  {
    name: 'products',
    rowCount: 450,
    columns: [
      { name: 'id', type: 'serial', isPrimaryKey: true },
      { name: 'name', type: 'varchar(100)' },
      { name: 'sku', type: 'varchar(50)' },
      { name: 'price', type: 'decimal(10,2)' },
      { name: 'stock_quantity', type: 'integer' },
      { name: 'category_id', type: 'integer', isForeignKey: true, references: { table: 'categories', column: 'id' } },
    ],
  },
  {
    name: 'orders',
    rowCount: 8900,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true },
      { name: 'user_id', type: 'uuid', isForeignKey: true, references: { table: 'users', column: 'id' } },
      { name: 'total_amount', type: 'decimal(10,2)' },
      { name: 'status', type: 'varchar(20)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'order_items',
    rowCount: 25000,
    columns: [
      { name: 'id', type: 'serial', isPrimaryKey: true },
      { name: 'order_id', type: 'uuid', isForeignKey: true, references: { table: 'orders', column: 'id' } },
      { name: 'product_id', type: 'integer', isForeignKey: true, references: { table: 'products', column: 'id' } },
      { name: 'quantity', type: 'integer' },
      { name: 'unit_price', type: 'decimal(10,2)' },
    ],
  },
  {
    name: 'categories',
    rowCount: 12,
    columns: [
      { name: 'id', type: 'serial', isPrimaryKey: true },
      { name: 'name', type: 'varchar(50)' },
      { name: 'description', type: 'text' },
    ]
  }
];

// Helper to generate fake data
const generateFakeRow = (columns: any[]) => {
  return columns.map(col => {
    if (col.type === 'uuid') return crypto.randomUUID();
    if (col.type === 'boolean') return Math.random() > 0.5;
    if (col.type === 'integer' || col.type === 'serial') return Math.floor(Math.random() * 1000);
    if (col.type.startsWith('decimal')) return (Math.random() * 1000).toFixed(2);
    if (col.type === 'timestamp') return new Date().toISOString();
    return `Sample ${col.name}`;
  });
};

export const connectDB = async (details: ConnectionDetails): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (details.isDemo) {
            resolve(true);
            return;
        }
        // Simulate real connection attempt
        if (!details.host || !details.user || !details.database) {
            reject(new Error("Missing required connection parameters"));
            return;
        }
        // Simulate a network random failure for realism
        if (Math.random() > 0.95) {
            reject(new Error("Connection timed out (5432)"));
            return;
        }
        resolve(true);
    }, 1200);
  });
}

export const getSchemas = async (): Promise<TableSchema[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(SCHEMAS), 300);
  });
};

export const executeQuery = async (query: string): Promise<QueryResult> => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const sanitizedQuery = query.trim().toUpperCase();
    const isReadOnly = sanitizedQuery.startsWith('SELECT') || sanitizedQuery.startsWith('EXPLAIN') || sanitizedQuery.startsWith('SHOW') || sanitizedQuery.startsWith('WITH');

    setTimeout(() => {
      const endTime = performance.now();
      const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

      if (!isReadOnly) {
        resolve({
          columns: [],
          rows: [],
          executionTimeMs,
          rowCount: 0,
          error: "Security Violation: Only read-only queries (SELECT, EXPLAIN, SHOW) are allowed.",
        });
        return;
      }

      // Mock Parser to find table name
      const words = query.toLowerCase().split(/\s+/);
      const fromIndex = words.indexOf('from');
      let targetTable = SCHEMAS[0]; 

      if (fromIndex !== -1 && words[fromIndex + 1]) {
        const requestedTableName = words[fromIndex + 1].replace(/[";]/g, '');
        const found = SCHEMAS.find(s => s.name === requestedTableName);
        if (found) targetTable = found;
      }

      // Generate Data
      const limit = 100; // Hard limit for mock
      const rows = Array.from({ length: limit }, () => generateFakeRow(targetTable.columns));
      
      resolve({
        columns: targetTable.columns.map(c => c.name),
        rows: rows,
        executionTimeMs,
        rowCount: limit, // Mocking a limited result set
      });
    }, 400); // Simulate network latency
  });
};

export const getTableData = async (tableName: string, page: number, pageSize: number): Promise<QueryResult> => {
    return executeQuery(`SELECT * FROM ${tableName} LIMIT ${pageSize} OFFSET ${page * pageSize}`);
}