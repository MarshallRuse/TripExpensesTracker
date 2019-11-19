// npm packages
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());


// project files
    // mongoose for db
require('../db/connection/mongoose');
    // routes

// Setup public folder and template views
const publicDirectoryPath = path.join(__dirname, '..', 'public');

// Setup static directory to serve
if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.resolve(__dirname, '..', 'build')));
} else {
    app.use(express.static(publicDirectoryPath));
}


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

if (process.env.NODE_ENV === 'production'){
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
    });
} else{
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicDirectoryPath, 'index.html'));
    });
}


const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
