require ('dotenv').config();

require('dotenv').config();
const express = require('express');
const db = require('./src/database/db');
const authMiddleware = require('./src/middleware/auth');
const { getStatusByDate } = require('./src/monitor/healthMonitor');

const API_KEY = process.env.API_KEY;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Automation Hours Service running' });
});

app.get('/secure-test', authMiddleware, (req, res) => {
    res.json({ message: 'You are authorized' });
});

// 🔹 GET hours (va aquí)
app.get('/api/hours', authMiddleware, (req, res) => {
    db.all("SELECT * FROM hours ORDER BY date DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 🔹 POST hours (también aquí)
app.post('/api/hours', authMiddleware, (req, res) => {

    const { date, hours, source } = req.body;

    if (!date || !hours) {
        return res.status(400).json({ error: 'Date and hours are required' });
    }

    db.run(
        `INSERT INTO hours (date, hours, source) VALUES (?, ?, ?)`,
        [date, hours, source || null],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: 'Hours inserted successfully',
                id: this.lastID
            });
        }
    );

});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});


app.get('/api/status', (req, res) => {

    getStatusByDate((err, status) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(status);
    });

});