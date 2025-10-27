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

// Create connection configuration with proper environment variables
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    // For Aiven MySQL
    rejectUnauthorized: true
  },
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    require: true
  },

  // Optional: Connection pooling settings for performance
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Log connection details (excluding sensitive info)
console.log('Database connection config:', {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user
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
      throw err;
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

// Export both pool and executeQuery
export default {
  pool,
  executeQuery
};