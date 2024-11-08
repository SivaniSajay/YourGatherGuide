// server.js
const express = require('express');
const app = express();
const port = 3000;
const { Client } = require('pg');
const path = require('path');

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection configuration
const dbConfig = {
  host: '172.17.0.2',       // e.g., 'localhost'
  user: 'postgres',       // e.g., 'postgres'
  password: 'mysecretpassword', // e.g., 'password'
  database: 'eventsystem', // Database name
  port: 5432,         // e.g., 5432
};

// Endpoint to fetch budget data
app.get('/getBudgetData', async (req, res) => {
  const client = new Client(dbConfig);
  try {
    await client.connect();

    // Query to fetch data for a specific user (e.g., user_id = 1)
    const result = await client.query(`
      SELECT *
      FROM event_planning
      WHERE user_id = 1;
    `);

    if (result.rows.length > 0) {
      const row = result.rows[0];

      // Structure the data
      const data = {
        username: row.username,
        userBudget: parseFloat(row.user_budget),
        selectedItems: [
          {
            category: 'Venue',
            item: row.venue_name,
            price: parseFloat(row.venue_price),
          },
          {
            category: 'Catering',
            item: row.catering_name,
            price: parseFloat(row.catering_price),
          },
          {
            category: 'Decoration',
            item: row.decoration_name,
            price: parseFloat(row.decoration_price),
          },
          {
            category: 'Entertainment',
            item: row.entertainment_name,
            price: parseFloat(row.entertainment_price),
          },
          {
            category: 'Miscellaneous',
            item: row.miscellaneous_name,
            price: parseFloat(row.miscellaneous_price),
          },
        ],
      };

      res.json(data);
    } else {
      res.status(404).json({ error: 'User data not found.' });
    }
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    await client.end();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
