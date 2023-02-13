const express = require("express");
const router = express.Router();
const ctrlLog = require("../controllers/wechat.router");

router.get("/getqrcode", async (req, res) => {
    try {
        return await ctrlLog.getQrcode(req, res);
    } catch (err) {
        console.log(err);
    }
});
router.get("/check", async (req, res) => {
    try {
        return ctrlLog.check(req, res);
    } catch (err) {
        console.log(err);
    }
});

router.post("/getuserinfo", async (req, res) => {
    try {
        return await ctrlLog.getUserInfo(req, res);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
