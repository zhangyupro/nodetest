const commonDb = require("../controllers/common.db");
const userInfoDB = require('../controllers/user_info.db')
const router = require('express').Router()

const prefix = '/user-info'
const tableName = 'user_info'

module.exports = {router , prefix, tableName}

router.post('/action/register' ,(req, res) => {
    try {
        if (!req.body.username) {
            res.json({
                code: '200',
                msg: '用户名不能为空'
            })
        } else if (! req.body.password) {
            res.json({
                code: '200',
                msg: '密码不能为空'
            })
        }

        let count = userInfoDB.countUsername(req.body.username)

        if (count) {
            res.json({
                code: '200',
                msg: '用户已存在'
            })
        } else {
            commonDb.insert(req.body, res, tableName)
        }
    } catch (err) {
        console.log(err)
    }
})

console.log("hello");