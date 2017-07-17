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

app.use(expressValidator({
    customValidators: {
        isBetween: function(value, limits) {
            let min = limits.min;
            let max = limits.max;

            return value >= min && value <= max;
        }
    }
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.set('trust proxy', true);

let mysql = require('./app/services/service.mysql');
mysql.createPool(dbConfig);

let routes = require('./app/routes');
let router = routes(express.Router());

app.use(express.static(__dirname + '/public'));

app.use('/api/v1', morgan('combined'), router);

app.use(function(req, res){
    res.status(404);
    res.send({
        path: req.path,
        method: req.method,
        error: 'API doesn\'t exists'
    });
});

app.listen(expressConfig.port, expressConfig.bindAddress);