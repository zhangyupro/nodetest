const fs = require('fs')
const path = require('path')
const ctrl = require('../controllers/common.ctrl')
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

        await commonRoutes(data.router, data.tableName)
    }
}

async function commonRoutes(router, tableName) {
    router.delete('/:id', async (req, res) => {
        try {
            if (await ctrl.deleteById(req.params.id, tableName)) {
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

            if (await ctrl.insert(req.body, tableName)) {
                res.json(rest.ok(true, '添加成功'))
            } else {
                res.json(rest.err(false, '添加失败'))
            }
        } catch (err) {
            throw err
            res.json(rest.err(false, err.msg))
        }
    })

    router.put('/:id', async (req, res) => {
        try {
            let result = await ctrl.updateById(req.params.id, req.body, tableName)
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
            let result = await ctrl.selectById(req.params.id, tableName)

            res.json(rest.ok(result))
        } catch (err) {
            res.json(rest.err(null, err.msg))
        }
    })

    router.get('/', async (req, res) => {
        try {
            let result = await ctrl.selectList(tableName, req.query)
            res.json(rest.ok(result))
        } catch (err) {
            res.json(rest.err(null, err.msg))
        }
    })

}

module.exports = { autoRegister }