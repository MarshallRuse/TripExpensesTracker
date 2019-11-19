// npm packages
const path = require('path');
const express = require('express');
const app = express();


// project files
    // mongoose for db
require('../db/connection/mongoose');
    // routes

// Setup public folder and template views
const publicDirectoryPath = path.join(__dirname, '..', 'public');

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Setup default JSON usage
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({
    limit: '20mb',
    extended: true
}));

const tripRouter = require('./routes/trips');
const expenseRouter = require('./routes/expenses');

// Setup routes to use
app.use(tripRouter);
app.use(expenseRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
