// lib/db.js

import mysql from 'mysql2/promise';

// 1. Create a connection pool using environment variables
const pool = mysql.createPool({
  // Connection details pulled from the .env.local file
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

  // Optional: Connection pooling settings for performance
  waitForConnections: true,
  connectionLimit: 10, // Max number of concurrent connections
  queueLimit: 0        // Unlimited queue for waiting connections
});

// 2. Export the pool for use in API routes
export default pool;