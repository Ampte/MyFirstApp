const mysql = require('mysql');
const express = require('express');
const router = express.Router();

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'amptemarak',
    database: '2nd_semester_students'
});

router.post('/add', (req, res) => {
    // Extract data from request body
    const { name, rollno, major } = req.body;

    // Use a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool: ', err);
            return res.status(500).send('<h1>Database error</h1>');
        }

        // Check if the name already exists in the database
        connection.query('SELECT * FROM students WHERE name = ?', [name], (error, results) => {
            if (error) {
                connection.release(); // Release the connection
                console.error('Error executing query: ', error);
                return res.status(500).send('<h1>Database error</h1>');
            }

            // If the name doesn't exist, insert a new row
            if (results.length === 0) {
                connection.query('INSERT INTO students (name, rollno, major) VALUES (?, ?, ?)', [name, rollno, major], (insertError, insertResults) => {
                    connection.release(); // Release the connection
                    if (insertError) {
                        console.error('Error executing query: ', insertError);
                        return res.status(500).send('<h1>Database error</h1>');
                    }
                    res.status(200).send('<h1>Data added successfully</h1>');
                });
            } else {
                connection.release(); // Release the connection
                res.status(200).send('<h1>Data already exists</h1>');
            }
        });
    });
});

module.exports = router;
