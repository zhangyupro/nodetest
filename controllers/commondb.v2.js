const dbConn = require('../db_config').promise()

exports.insert = async (body,tableName) => {
    let sql =  `insert into ${tableName} set `

    let sqlParam = []
    for (const key in body) {
        sql += ` ${key} = ? ,`

        sqlParam.push(`${body[key]}`)
    }

    sql = sql.slice(0, sql.length-1)

    try {
        let [body] = await dbConn.query(sql , sqlParam)

        return body.affectedRows === 1
    } catch (err) {
        throw err
    }
}

exports.updateById = async (id, body, tableName) => {
    if (!id) {
        return false
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

    try {
        let [body] = await dbConn.query(sql , sqlParam)

        return body.affectedRows === 1
    } catch (err) {
        throw err
    }
}

exports.deleteById = async (id, res, tableName) => {
    if (!id) {
        res.json({
            code: '500',
            msg: 'id不能为null'
        })
    }

    let sql = `delete from ${tableName} where id = ?  `

    try {
        let [body] = await dbConn.query(sql , [id])

        return body.affectedRows === 1
    } catch (err) {
        throw err
    }
}

exports.selectById = async (id, tableName) => {

    let sql = `select * from ${tableName} where id = ?`

    try {
        let [[body]] = await dbConn.query(sql , [id])

        if (!body) {
            return null
        } else {
            return body
        }

    } catch (err) {
        throw err
    }
}

exports.readList = async (tableName, query) => {
    let pagePrefix = 'select * '
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

    let data = {}
    if (query && query.page && query.size) {
        data.page = query.page * 1
        data.size = query.size * 1
    }

    try {
        let total = await this.count(tableName, query)

        if (total && total.total) {
            data.total = total.total
        }
    } catch (err) {
        throw err
    }

    let sort = ''
    if(query && query.hasOwnProperty('sort')) {
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
    if (query && query.hasOwnProperty('page')
        && query.hasOwnProperty('size')) {
        let numPerPage = query.size * 1
        let skip = (query.page-1) * numPerPage;

        limit += 'limit ?, ? '

        sqlParam.push(skip)
        sqlParam.push(numPerPage)
    }

    try {
        let [queryRes] = await dbConn.query(pagePrefix + sql + limit, sqlParam)

        if (queryRes) {
            data.content = queryRes
        } else {
            data.content = []
        }
        console.log(data)
        return data
    } catch (err) {
        throw err
    }

}

exports.count = async (tableName, query) =>{
    let countPrefix = 'select count(1) AS total '
    let sql = `from ${tableName} `
    let sqlParam = []
    if (query) {
        let sqlSelect = ''
        for (const key in query) {
            if (key !== 'sort' && key !== 'page' && key !== 'size')
            sqlSelect += ` ${key} like ? ,`

            sqlParam.push(`%${query[key]}%`)
        }

        if (sqlSelect) {
            sql += 'where '
            sql += sqlSelect
            sql = sql.slice(0, sql.length-1);
        }
    }

    try {
        let [[total]] = await dbConn.query(countPrefix + sql, sqlParam)

        return total
    } catch (err) {
        throw err
    }
}
