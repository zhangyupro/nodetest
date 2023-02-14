const rest = require("../util/rest.util");
const router = require('express').Router()
const userCtrl = require('../controllers/user_info.ctrl')

router.post('/action/register', (req, res) => {
    try {
        res.json(userCtrl.register(req.body))
    } catch (err) {
        res.json(rest.err(res, false, err.msg))
    }
})

router.get('/action/sync', async (req, res) => {
    try {
        await userCtrl.syncWxData()
        res.json(rest.ok(res, true, '企业微信用户数据同步完成'))
    } catch (err) {
        res.json(rest.err(res, false, err.msg))
    }
})
module.exports = {router}