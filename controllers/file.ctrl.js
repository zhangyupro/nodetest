const { log } = require("console");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
  if (!req.files) {
    res.send({
      code: 400,
      msg: "上传文件不能为空",
    });
    return;
  }
  let files = req.files;
  let ret_files = [];
  try {
    //将files遍历，结果是value（file）
    //substring(截掉前多少个字符)
    //lastIndexOf('.')到.有几位字符
    //file_ext为后缀名，例如img,mp3
    for (let file of files) {
      let file_ext = file.originalname.substring(
        file.originalname.lastIndexOf(".") + 1
      );
      //将文件名改为时间戳
      let file_name = new Date().getTime() + "." + file_ext;
      //fs.renameSync(a,b):a更名并移动到b

      fs.renameSync(
        //process.cwd()用于获取node.js流程的当前工作目录
        process.cwd() + "/public/upload/temp/" + file.filename,
        process.cwd() + "/public/upload/" + file_name
      );

      ret_files.push("./public/upload/" + file_name);
      // console.log(ret_files);
    }
    return ret_files.length >= 1;
  } catch (err) {
    res.send(err);
  }
};

exports.downloadFile = async (req, res) => {
  let file_name = req.query.file_name;
  // console.log(req.query);
  // console.log(file_name);
  let file_path = process.cwd() + "/public/upload/" + file_name;
  // res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
  // res.setHeader('Content-Disposition', 'attachment;fileName='+fileName);
  // res.setHeader('Content-Disposition', 'attachment;fileName='+file_name);
  // res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.set({
    "Content-Type": "application/octet-stream", // 告诉浏览器这是一个二进制文件
    "Content-Disposition": "attachment; filename=" + file_name, // 告诉浏览器这是一个需要下载的文件
  });
  res.download(file_path);
  // console.log(res.download);
  // return 1;
};

// exports.downloadFile = async (req, res) => {
//     let file_name = req.query.file_name;
//     let file_path = process.cwd() + "/public/upload/" + file_name;
//   res.set({
//     "Content-Type": "application/octet-stream", //告诉浏览器这是一个二进制文件
//     "Content-Disposition": "attachment; filename="`${file_name}`, //告诉浏览器这是一个需要下载的文件
//   });
//   fs.createReadStream(file_path).pipe(res);
// };
