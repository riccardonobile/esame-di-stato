'use strict';

let mysql = require('../services/service.mysql'),
    format = require('string-template'),
    fs = require('fs');

let db = mysql.getConnection();

let getAll = function(callback) {
    let query = fs.readFileSync('./queries/times/query.getAll.sql').toString();

    db.query(query, function (err, rows) {
        callback(err, rows);
    });
};

let insert = function(runnerId, raceId, time, callback) {
    let query = fs.readFileSync('./queries/times/query.insert.sql').toString();

    query = format(query, {
        runnerId: db.escape(runnerId),
        raceId: db.escape(raceId),
        time: db.escape(time)
    });

    db.query(query, function (err, rows) {
        callback(err, rows);
    });
};

module.exports = {
    getAll,
    insert
};
