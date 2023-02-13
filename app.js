const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080

app.use(cors());
app.use(express.json())

// 修改为自动注册路由
const auto =  require('./routes/auto_register')
auto.autoRegister(app)

app.listen(port,() => {
    console.log(`express start success in ${port}`)
})