const fs = require('fs')
const path = require('path')
const commonDb = require("../controllers/common.db")
const commonDbV2 = require('../controllers/commondb.v2')
const rest = require('../util/rest.util')

// 动态注册路由
const autoRegister = async (app) => {
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

        await commonRoutesV2(data.router, data.tableName)
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

async function commonRoutesV2(router, tableName) {
    router.delete('/:id', async (req, res) => {
        try {
            if (await commonDbV2.deleteById(req.params.id, tableName)) {
                res.json(rest.ok(true, '删除成功'))
            } else {
                res.json(rest.err(false, '删除失败'))
            }
        } catch (err) {
            res.json(rest.err(res, false, err.msg))
        }
    })

    router.post('/', async (req, res) => {
        try {

            if (await commonDbV2.insert(req.body, tableName)) {
                res(rest.ok(true, '添加成功'))
            } else {
                res(rest.err(false, '添加失败'))
            }
        } catch (err) {
            res.json(rest.err(false, err.msg))
        }
    })

    router.put('/:id', async (req, res) => {
        try {
            let result = await commonDbV2.updateById(req.params.id, req.body, tableName)
            if (result) {
                res.json(rest.ok(true, '更新成功'))
            } else {
                res.json(rest.err(false, '更新失败'))
            }
        } catch (err) {
            res.json(rest.err(res, false, err.msg))
        }
    })

    router.get('/:id', async (req, res) => {
        try {
            let result = await commonDbV2.selectById(req.params.id, tableName)

            res.json(rest.ok(result))
        } catch (err) {
            res.json(rest.err(null, err.msg))
        }
    })

    router.get('/', async (req, res) => {
        try {
            let result = await commonDbV2.readList(tableName, req.query)
            res.json(rest.ok(result))
        } catch (err) {
            res.json(rest.err(null, err.msg))
        }
    })

}

module.exports = { autoRegister }