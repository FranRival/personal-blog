require('dotenv').config();
const express = require('express');
require('./src/database/db');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Automation Hours Service running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
