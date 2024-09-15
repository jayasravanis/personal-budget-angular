const express = require('express')
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use('/', express.static('public'))

app.get('/hello', (req, res) => {
    res.send('Hello World!!');
});

app.get('/budget', (req, res) => {
    const filePath = path.join(__dirname, 'budget.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const budgetData = JSON.parse(data);
            res.json(budgetData);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.listen(port, () => {
    console.log(`Personal Budget app listening at http://localhost:${port}`);
});