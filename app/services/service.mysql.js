'use strict';

let mysql = require('mysql2');

let pool;

let createPool = function(dbConfig) {
    pool = mysql.createPool(dbConfig);
};

let getConnection = function() {
    return pool;
};

module.exports = {
    createPool,
    getConnection
};