const dbConn = require('../config/db.config')

exports.countUsername  =  function countUsername (username) {
    const promisePool = dbConn.promise();

    const rows = promisePool.query('select count(*) total from user_info where username = ?', [username]);
    console.log(rows[0][0].total)
    return rows
}



