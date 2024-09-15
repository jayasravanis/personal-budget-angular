const express = require('express')
const app = express();
const port = 3000;

app.use('/', express.static('public'))

const budget = {
    'myBudget': [
        {
            title: 'Eat out',
            budget: 30
        },
        {
            title: 'Rent',
            budget: 515
        },
        {
            title: 'Groceries',
            budget: 120
        }
    ]
};

app.get('/hello', (req, res) => {
    res.send('Hello World!!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Personal Budget app listening at http://localhost:${port}`);
});