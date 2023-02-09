const fs = require('fs')
const path = require('path')
const commonDb = require("../controllers/common.db");

// 动态注册路由
const autoRegister = (app) => {
    // 拿到当前文件夹下所有文件名
    const res = fs.readdirSync(path.resolve(__dirname))

    for (let i = 0; i < res.length; i++) {
        // 如果是当前auto_register.js文件则不注册
        if (!res[i].endsWith('.router.js')) {
            continue
        }

        // 根据文件名引入文件
        const data = require(`./${res[i]}`)

        if (!data.tableName) {
            data.tableName = res[i].replace('.router.js', '')
        }

        if (!data.prefix) {
            data.prefix = '/' + data.tableName.replace('_', '-')
        }

        if (!data.router) {
            data.router = require('express').Router()
        }

        // 注册了路由
        app.use(data.prefix, data.router)

        commonRoutes(data.router, data.tableName, data.doBeforeCreate)
    }
}

function commonRoutes (router, tableName) {
    router.delete('/:id', (req, res) => {
        try {
           commonDb.deleteById(req.params.id, res, tableName)
        } catch (err) {
            console.log(err)
        }
    })

    router.post('/', (req, res) => {
        try {

           commonDb.insert(req.body, res, tableName)
        } catch (err) {
            console.log(err)
        }
    })

    router.put('/:id', (req, res) => {
        try {
           commonDb.updateById(req.params.id, req.body, res, tableName)
        } catch (err) {
            console.log(err)
        }
    })

    router.get('/:id', (req, res) => {
        try {
            commonDb.selectById(req.params.id, res, tableName)
        } catch (err) {
            console.log(err)
        }
    })

    router.get('/', (req, res) => {
        try {
            commonDb.page(req.query, tableName, res);
        } catch (err) {
            console.log(err)
        }
    })

}

module.exports = { autoRegister }