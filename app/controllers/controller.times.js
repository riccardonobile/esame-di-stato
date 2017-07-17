'use strict';

let unirest = require('unirest');

const checkUrl = 'https://run-check-2017.mvlabs.it/check/';

const schema = {
    'raceId': {
        in: 'params',
        notEmpty: true,
        errorMessage: 'Required'
    },
    'id': {
        in: 'body',
        notEmpty: true,
        isInt: {
            errorMessage: 'Must be int'
        },
        isBetween: {
            options: [{
                min: 1,
                max: 150
            }],
            errorMessage: 'Out of range'
        }
    },
    'time': {
        in: 'body',
        notEmpty: true,
        isInt: {
            errorMessage: 'Must be int'
        }
    }
};

let timesModel = require('../models/model.times');

let getAll = function(req, res) {
    timesModel.getAll(function(err, data) {
        if (err) {
            res.status(500).json({
                status: 'Server Error',
                data: []
            })
        } else {
            res.status(200).json({
                status: 'OK',
                data: data
            })
        }
    });
};

let insert = function(req, res) {
    req.check(schema);

    req.getValidationResult().then(function(errors) {
        if (!errors.isEmpty()) {
            errors = errors.mapped();
            res.status(400).json({
                status: 'Bad Request',
                errors: errors
            });
        } else {
            res.status(200).json({
                status: 'OK',
                data: []
            });
        }
    });


};

module.exports = {
    getAll,
    insert
};
