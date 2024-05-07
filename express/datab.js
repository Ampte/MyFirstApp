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


router.post('/submit', (req, res) => {
    // Extract data from request body
    const { name, rollno, major } = req.body;

    // Use a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool: ', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Check if the name already exists in the database
        connection.query('SELECT * FROM students WHERE name = ?', [name], (error, results) => {
            if (error) {
                connection.release(); // Release the connection
                console.error('Error executing query: ', error);
                return res.status(500).json({ error: 'Database error' });
            }

            // If the name exists, send the corresponding row in HTML table format
            if (results.length > 0) {
                const student = results[0];
                const htmlTable = `
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Major</th>
                        </tr>
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.rollno}</td>
                            <td>${student.major}</td>
                        </tr>
                    </table>
                `;
                connection.release(); // Release the connection
                return res.status(200).send(htmlTable);
            }else {
			res.send('<h1>Cannot find data</h1>')}
        });
    });
});

module.exports = router;