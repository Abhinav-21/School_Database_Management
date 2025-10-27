// lib/db.js

import mysql from 'mysql2/promise';

const validateEnvVariables = () => {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Log connection details for debugging (excluding sensitive info)
  console.log('Database configuration:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER
  });
};

// Validate environment variables before creating pool
validateEnvVariables();

// Build connection config (keep it minimal and explicit)
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Pool settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Handle SSL option (Aiven often requires SSL). If DB_SSL=REQUIRED use ssl, otherwise omit.
if (process.env.DB_SSL && process.env.DB_SSL.toUpperCase() === 'REQUIRED') {
  // In serverless environments it's common to skip strict cert verification unless a CA is provided.
  // If you have the CA, consider providing it here instead of setting rejectUnauthorized to false.
  config.ssl = { rejectUnauthorized: false };
}

// Log connection details (excluding sensitive info)
console.log('Database connection config:', {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  ssl: !!config.ssl
});

// Create a connection pool using environment variables
let pool;

try {
  pool = mysql.createPool(config);

  // Test the connection
  pool.getConnection()
    .then(connection => {
      console.log('Database connection was successful');
      connection.release();
    })
    .catch(err => {
      console.error('Error establishing database connection:', err);
      // Don't rethrow here synchronously; let callers see connection failures later with useful logs
    });
} catch (error) {
  console.error('Failed to create connection pool:', error);
  throw error;
}

// Function to execute queries with error handling
export async function executeQuery({ query, values = [] }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Export the pool as default so existing code that expects `db.query` continues to work
export default pool;