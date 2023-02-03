const  express = require('express');
const transactionRouter = require('./routes/transactionRoutes');

const cors = require('cors');

const app = express();

app.use(cors());

app.options('*', cors());

app.use(express.json());

// ROUTES

app.use('/api/transactions', transactionRouter);

module.exports = app;