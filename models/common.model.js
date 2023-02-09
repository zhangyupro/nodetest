const dbConn = require('../db_config')

class Entity {

    constructor(entity) {
        this.id = entity.id
    }

    insert(res, tableName) {

        let sql =  `insert into ${tableName} set `

        let sqlParam = []
        for (const key in this) {
            sql += ` ${key} = ? ,`

            sqlParam.push(`${body[key]}`)
        }

        sql = sql.slice(0, sql.length-1)

        dbConn.query(sql, sqlParam, (err, result) => {
            if (err) {
                res.json({
                    code: '500',
                    msg: '添加数据失败'
                })
            } else {
                res.json({
                    code: '200',
                    msg: '添加成功'
                })
            }
        })
    }

    updateById(res, tableName) {
        if (!this.id) {
            res.json({
                code: '500',
                msg: 'id不能为null'
            })
        }

        let sql =  `update user_info ${tableName} set `

        let sqlParam = []
        for (const key in this) {
            sql += ` ${key} = ? ,`

            sqlParam.push(`${body[key]}`)
        }

        sql = sql.slice(0, sql.length-1);

        sql += `where id = ?`
        sqlParam.push(this.id)

        dbConn.query(sql, sqlParam, (err, result) => {
            if (err) {
                res.json({
                    code: '500',
                    msg: '更新数据失败'
                })
            } else {
                res.json({
                    code: '200',
                    msg: '更新成功'
                })
            }
        })
    }
    deleteById(res, tableName) {
        if (!this.id) {
            res.json({
                code: '500',
                msg: 'id不能为null'
            })
        }

        let sql =  `delete from ${tableName} where id = ?  `

        dbConn.query(sql, this.id, (err, result) => {
            if (err) {
                res.json({
                    code: '500',
                    msg: '删除数据失败'
                })
            } else {
                res.json({
                    code: '200',
                    msg: '删除成功'
                })
            }
        })
    }

    selectById(res, tableName) {

        let sql = `select * from ${tableName} where id = ?`

        dbConn.query(sql, this.id, (err, result) => {
            if (err) {
                res.json({
                    code: '500',
                    msg: '查询失败'
                })
            } else if (!result) {
                res.json({
                    code: '200',
                    msg: '查询成功',
                    data: null
                })
            } else {
                res.json({
                    code: '200',
                    msg: '查询成功',
                    data: result[0]
                })
            }
        })
    }

    selectAll(res, tableName) {

        let sql = `select * from ${tableName}`

        dbConn.query(sql,(err, result) => {
            if (err) {
                res.json({
                    code: '500',
                    msg: '查询失败'
                })
            } else if (!result) {
                res.json({
                    code: '200',
                    msg: '查询成功',
                    data: []
                })
            } else {
                res.json({
                    code: '200',
                    msg: '查询成功',
                    data: result
                })
            }
        })
    }
}
module.exports = Entity