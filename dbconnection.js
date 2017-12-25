var mysql = require('mysql');

var connection = mysql.createPool({

    host: 'localhost',
    user: 'kranthi',
    password: 'kranthi123',
    database: 'connectto'
});

module.exports = connection;