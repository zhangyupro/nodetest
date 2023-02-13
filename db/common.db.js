const dbConn = require('../config/db.config')

exports.insert = function insert(body, res, tableName, doBefore) {
    if (null !== doBefore) {
       doBefore()
    }

    let sql =  `insert into ${tableName} set `

    let sqlParam = []
    for (const key in body) {
        sql += ` ${key} = ? ,`

        sqlParam.push(`${body[key]}`)
    }

    sql = sql.slice(0, sql.length-1)

    dbConn.query(sql, sqlParam, (err, result) => {
        if (err) {
            res.json({
                code: '500',
                msg: err.message
            })
        } else {
            res.json({
                code: '200',
                msg: '添加成功'
            })
        }
    })
}

exports.updateById = function updateById(id, body, res, tableName) {
    if (!id) {
        res.json({
            code: '500',
            msg: 'id不能为null'
        })
    }

    let sql =  `update ${tableName} set `

    let sqlParam = []
    for (const key in body) {
        sql += ` ${key} = ? ,`

        sqlParam.push(`${body[key]}`)
    }

    sql = sql.slice(0, sql.length-1);

    sql += `where id = ?`
    sqlParam.push(id)

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

exports.deleteById = function deleteById(id, res, tableName) {
    if (!id) {
        res.json({
            code: '500',
            msg: 'id不能为null'
        })
    }

    let sql =  `delete from ${tableName} where id = ?  `

    dbConn.query(sql, id, (err, result) => {
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

exports.selectById = function (id, res, tableName,dob,dof) {
    dob()

    let sql = `select * from ${tableName} where id = ?`

    dbConn.query(sql, id, (err, result) => {
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

exports.selectAll = function (res, tableName) {

    let sql = `select * from ${tableName}`

    dbConn.query(sql,(err, result) => {
        if (err) {
            console.log(err.message)
            res.json({
                code: '500',
                msg: '查询失败',
                data: err.message
            })
        } else if (!result) {
            res.json({
                code: '800',
                msg: '查询成功',
                data: []
            })
        } else {
            res.json({
                code: '800',
                msg: '查询成功',
                data: result
            })
        }
    })
}

exports.page = function (query, tableName, res) {
    let pagePrefix = 'select * '
    let countPrefix = 'select count(1) AS total '
    let sql = `from ${tableName} `
    let sqlParam = []
    if (query) {
        let sqlSelect = ''
        for (const key in query) {
            if (key !== 'sort'
                && key !== 'page'
                && key !== 'size') {
                sqlSelect += ` ${key} like ? ,`

                sqlParam.push(`%${query[key]}%`)
            }
        }

        if (sqlSelect) {
            sql += 'where '
            sql += sqlSelect
            sql = sql.slice(0, sql.length-1);
        }

    }

    let sort = ''
    if(query.hasOwnProperty('sort')) {
        sort += 'order by '

        let sortArray = []

        if (typeof query.sort === 'string') {
            sortArray.push(query.sort)
        } else {
            sortArray = query.sort
        }

        for (const sortArrayKey in sortArray) {
            let [sortParam, sortMethod] = sortArray[sortArrayKey].split('-')

            if (sortMethod !== 'desc' && sortMethod !== 'asc') {
                sortMethod = 'desc'
            }
            sort += `${sortParam} ${sortMethod} ,`
        }

        sort = sort.slice(0, sort.length-1)

        sql += sort
    }

    let limit = ''
    if (query.hasOwnProperty('page')
        && query.hasOwnProperty('size')) {
        let numPerPage = query.size * 1
        let skip = (query.page-1) * numPerPage;

        limit += 'limit ?, ? '

        sqlParam.push(skip)
        sqlParam.push(numPerPage)
    }

    dbConn.query(pagePrefix + sql + limit,sqlParam, function (err, rows, fields) {
        if(err) {
            res.json({
                code: '500',
                msg: '查询失败',
                data: err.message
            })
        }else{
            let content = rows;
            if (!content) {
                content = []
            }

            let data = {}
            data.content = content
            data.page = query.page * 1
            data.size = query.size * 1

            dbConn.query(countPrefix + sql, sqlParam , function (err, total) {

                data.total = total[0].total

                res.json({
                    code: '200',
                    msg: '查询成功',
                    data: data
                })
            })
        }
    });
}

console.log("sbgit 2");