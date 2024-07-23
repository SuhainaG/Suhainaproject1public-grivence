const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS grievances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        message TEXT,
        complaint TEXT,
        location TEXT
    )`);
});

// Endpoint to get all grievances
app.get('/grievances', (req, res) => {
    db.all('SELECT * FROM grievances', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to add a new grievance
app.post('/grievances', (req, res) => {
    const { name, email, phone, message, complaint, location } = req.body;
    db.run(
        `INSERT INTO grievances (name, email, phone, message, complaint, location)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone, message, complaint, location],
        function(err) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.status(201).send({ id: this.lastID });
            }
        }
    );
});

// Endpoint to delete a grievance
app.delete('/grievances/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM grievances WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send({ deleted: this.changes });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
