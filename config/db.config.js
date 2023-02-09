const mysql = require('mysql2')

const dbConn = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'zsr000210',
    database: 'test'
})

module.exports = dbConn