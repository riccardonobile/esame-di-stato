'use strict';

let unirest = require('unirest');

const checkUrl = 'https://run-check-2017.mvlabs.it/check';

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
            errorMessage: 'Must be int or out of range'
        },
        isBetween: {
            options: [{
                min: 1,
                max: 150
            }],
            errorMessage: 'Must be int or out of range'
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
        console.log(err);
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
            let raceId = req.params.raceId,
                runnerId = req.body.id,
                time= req.body.time;

            let message = '';

            unirest.get(checkUrl + '/' + runnerId).send().end(function (response) {
                if(response.statusType === 2 && response.body !== undefined) {
                    let json = JSON.parse(response.body);
                    if(!json.valid) {
                        time = null;
                        message = 'Disqualified runner';
                    } else {
                        message = 'Runner time added'
                    }
                    timesModel.insert(runnerId, raceId, time, function(err, data) {
                        console.log(err);
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                status: 'Server Error',
                                data: []
                            })
                        } else {
                            res.status(201).json({
                                status: 'Created',
                                data: [{
                                    runnerId: runnerId,
                                    raceId: raceId,
                                    time: time
                                }],
                                message: message
                            })
                        }
                    });
                } else {
                    res.status(404).json({
                        status: 'Runner id not found in the check API',
                        runnerId: runnerId
                    })
                }
            });
        }
    });


};

module.exports = {
    getAll,
    insert
};
