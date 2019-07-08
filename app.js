const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const bluebird = require('bluebird');
const Sequelize = require('sequelize');
const config = require('./config/appConfig');
const responseWrapper = require('./middlewares/responseWrapper');
const { CustomError, notification } = require('./utilities');

// Set Global Promise & empty & CustomError & SendNotifications
global.Promise = bluebird;
global.empty = require('is-empty');
global.CustomError = CustomError;
global.SendNotifications = notification({ notifications: config.notifications });

// Configure Sequelize SEQUELIZE
const {database, username, password, dialect, host} = config.db;
const sequelize = new Sequelize(database, username, password, {
    dialect,
    host
});
global.sequelize = sequelize;// Push sequelize to global
global.models = require('./models/index');// Push models to global

// Create new express app and get the port
const app = express();
const port = config.PORT;

// Configure the app Middlewares
app.use(helmet.hidePoweredBy({ setTo: 'PHP/5.4.0'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('[:date[clf]] :method :url :status :response-time ms - :res[content-length]'));

// Allow Origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// Import Routes
const bulletinRoute = require('./routes/bulletin');
const commentRoute = require('./routes/comment');

// Route Middlewares
app.use('/api/bulletin', bulletinRoute);
app.use('/api/comment', commentRoute);

// The Catch all Not found route
app.all('*', (req, res, next) => next(new CustomError('Not Found', 404)));

// Error handler
app.use(responseWrapper.errorHandler);

// Data handler
app.use(responseWrapper.dataHandler);

// Bind the app to the port
app.listen(port, () => console.log(`Server Up and Running \n=> http://localhost:${config.PORT}`));

module.exports = app;