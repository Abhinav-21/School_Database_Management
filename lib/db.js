// lib/db.js

import mysql from 'mysql2/promise';

// Function to validate required environment variables
const validateEnvVariables = () => {
  const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_SSL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
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
  ssl: process.env.DB_SSL === 'true',

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
const pool = mysql.createPool(config);

// 2. Export the pool for use in API routes
export default pool;