const tableName = 'user_info'
const rest = require('../util/rest.util')
const commonDb = require('../db/commondb.v2')
const {setGroupName} = require("./work_group.ctrl");

exports.register = (user) => {

    if (!user.username) {
        return rest.err(false, '用户名不能为空', 50001)
    }
    if (!user.password) {
        return rest.err(false, '密码不能为空', 50002)
    }

    let count = commonDb.count(tableName, {username:user.username})
    if (count > 0) {
        return rest.err(false, '当前用户名已存在', 50003)
    }

    let ok = commonDb.insert(user, tableName)
    if (ok) {
        return rest.ok(true, '注册成功')
    } else {
        return rest.err(false, '注册失败')
    }
}

const doSelectListAfter = async (array) => {
    await setGroupName(array)
}

module.exports = {doSelectListAfter}