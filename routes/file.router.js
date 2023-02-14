const { log } = require("console");
const express = require("express");
const fs = require("fs");
const ctrl = require("../controllers/file.ctrl");
const router = express.Router();
const rest = require("../util/rest.util");

// router.get('/download',async(req,res)=>{
//     let file_name =req.query.file_name
//     console.log(req.query);
//     console.log(file_name);
//     let file_path=process.cwd()+'/public/upload/'+file_name
//     res.download(file_path)
// // })
router.get("/download", async (req, res) => {
  try {
    let result = await ctrl.downloadFile(req, res);
    // console.log(result);
    // if (result) {
    //     res.json(rest.ok(true, '下载成功'))
    // } else {
    //     res.json(rest.err(false, '下载失败'))
    // }
  } catch (err) {
    console.log(err.msg)
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

// router.get("/download", (req, res) => {
//     let file_name = req.query.file_name;
//     let file_path = process.cwd() + "/public/upload/" + file_name;
//   res.set({
//     "Content-Type": "application/octet-stream", //告诉浏览器这是一个二进制文件
//     "Content-Disposition":` attachment; filename=${file_name}`, //告诉浏览器这是一个需要下载的文件
//   });
//   fs.createReadStream(file_path).pipe(res);
// //   res.json(rest.ok(true, "上传成功"));
// //   res.set({
// //     "Content-Type": "application/octet-stream", //告诉浏览器这是一个二进制文件
// //     "Content-Disposition": "attachment; filename=IMG_0169.JPG", //告诉浏览器这是一个需要下载的文件
// //   });
// //   fs.createReadStream("./public/" + "IMG_0169.JPG").pipe(res);
// });
module.exports = router;
