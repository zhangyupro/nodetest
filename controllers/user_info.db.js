const dbConn = require('../db_config')

exports.countUsername  =  function countUsername (username) {
    const promisePool = dbConn.promise();

    const rows = promisePool.query('select count(*) total from user_info where username = ?', [username]);
    console.log(rows[0][0].total)
    return rows
}

async function test (user) {
    for (const userKey in user) {
        console.log(userKey)
        console.log(user[userKey])
    }

}
test({username:"lbq", password:"123456"})


