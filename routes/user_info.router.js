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

module.exports = {router}