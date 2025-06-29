// At the very top, load the variables from the .env file
require('dotenv').config(); 

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
// Use the PORT from the .env file, or default to 3000
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Create MySQL connection USING the variables from .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    // If the database connection fails, the app can't do anything. 
    // It's often better to exit gracefully.
    process.exit(1); 
  }
  console.log('✅ Connected to MySQL!');
});

// API endpoint to fetch data
app.get('/api/data', (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
      \`Generation (MU)\`,
      \`Coal Cons. (MT)\`,
      \`Heat Rate (kcal/kWh)\`,
      \`Spec. Coal (kg/kWh)\`
    FROM 
      cleaned_cspgcl 
    ORDER BY 
      \`Date\`;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ SQL QUERY FAILED:', err); 
      res.status(500).json({ 
        message: 'Failed to execute database query.',
        error: err.sqlMessage 
      });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});