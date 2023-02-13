const mysql = require('mysql2')

const dbConn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l1ub1q1an',
    database: 'db1'
})

module.exports = dbConn
