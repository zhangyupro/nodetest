const { log } = require("console");
const express = require("express");
const fs = require("fs");
const ctrl = require("../controllers/file.ctrl");
const router = express.Router();
const rest = require("../util/rest.util");

router.get("/download", async (req, res) => {
  try {
    let result = await ctrl.downloadFile(req, res);
    console.log(result);
  } catch (err) {
    res.json(rest.err(res, false, err.msg));
  }
});

router.post("/upload", async (req, res) => {
  try {
    let result = await ctrl.uploadFile(req, res);
    if (result) {
      res.json(rest.ok(true, "上传成功"));
    } else {
      res.json(rest.err(false, "上传失败"));
    }
  } catch (err) {
    
    res.json(rest.err(res, false, err.msg));
  }
});
module.exports = {router};
