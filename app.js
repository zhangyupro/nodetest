const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const multer=require('multer')
const upload = multer({
    dest:'./public/upload/temp'//临时存放路径
})

app.use(cors());
app.use(express.json())

//允许上传各类文件
app.use(upload.any())
// 修改为自动注册路由
const auto =  require('./routes/auto_register')
auto.autoRegister(app)


app.listen(port,() => {
    console.log(`express start success in ${port}`)
})