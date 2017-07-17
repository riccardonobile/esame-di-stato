'use strict';

let cors = require('cors'),
    morgan = require('morgan'),
    express = require('express'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');

let dbConfig = require('./app/configs/config.db'),
    corsConfig = require('./app/configs/config.cors'),
    expressConfig = require('./app/configs/config.express');

let app = express();

app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(morgan('combined'));
app.set('trust proxy', true);

let mysql = require('./app/services/service.mysql');
mysql.createPool(dbConfig);

let routes = require('./app/routes');
let router = routes(express.Router());

app.use('/api/v1', router);

app.listen(expressConfig.port, expressConfig.bindAddress);