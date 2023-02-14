const dbConn = require('../config/db.config').promise()
const { v4: uuidv4 } = require('uuid');

exports.insert = async (body,tableName) => {

    if (!body.id) {
        body.id = uuidv4()
    }

    let conn = await dbConn.getConnection()

    let sql =  `insert into ${tableName} set `

    let sqlParam = []
    let sqlList = []
    for (const key in body) {
        sqlList.push(` ${key} = ? `)

        if (typeof body[key] === 'object') {
            sqlParam.push(JSON.stringify(body[key]))
        } else {
            sqlParam.push(`${body[key]}`)

        }

    }
    sql += sqlList.join(',')

    try {
        let [body] = await (conn).query(sql , sqlParam)

        return body.affectedRows === 1
    } catch (err) {
        throw err
    }
}


exports.batchDelete=async(body,tableName)=>{
    let conn = await dbConn.getConnection()
    let sql=`delete from ${tableName} where id in (`
    let sqlParam=[]
    body.forEach((element)=>{
        sql +=`?,`
        sqlParam.push(element.id)
        
    })
    sql= sql.slice(0,sql.length-1)
    sql +=`)`
    console.log(sql);
    console.log(sqlParam);
    try{
        let [body]=await(conn).query(sql,sqlParam)
        return body.affectedRows >= 1
    }
    catch(err){
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

        if (typeof body[key] === 'object') {
            sqlParam.push(JSON.stringify(`${body[key]}`))
        } else {
            sqlParam.push(`${body[key]}`)

        }
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

exports.deleteById = async (id, tableName) => {
    if (!id) {
        return false
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


    console.log(11111);
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
        let sqlSelect = []
        for (const key in query) {
            if (key !== 'sort'
                && key !== 'page'
                && key !== 'size') {
                let [param , endStr] = key.split('-')

                switch (endStr) {
                    case 'like':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`%${query[key]}%`)
                        continue
                    case 'llike':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`${query[key]}%`)
                        continue
                    case 'rlike':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`%${query[key]}`)
                        continue
                    case 'left':
                        sqlSelect.push(` ${param} > ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'lefte':
                        sqlSelect.push(` ${param} >= ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'right':
                        sqlSelect.push(` ${param} <= ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'righte':
                        ssqlSelect.push(` ${param} < ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'not':
                        sqlSelect.push(` ${param} != ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'in':
                        let inSql = ` ${param} in ( `

                        if (Array.isArray(query[key])) {
                            for (let i = 0; i < query[key].length; i++) {
                                inSql += ` ?,`
                                sqlParam.push(query[key][i])
                            }
                            inSql = inSql.slice(0, inSql.length-1)
                            inSql += ` ) `
                        } else {
                            inSql += ` ? ) `
                            sqlParam.push(query[key])
                        }
                        sqlSelect.push(inSql)
                        continue
                    case 'notin':
                        let notInSql = ` ${param} not in ( `

                        if (Array.isArray(query[key])) {
                            for (let i = 0; i < query[key].length; i++) {
                                notInSql += ` ?,`
                                sqlParam.push(query[key][i])
                            }
                            notInSql = notInSql.slice(0, notInSql.length-1)
                            notInSql += ` ) `
                        } else {
                            notInSql += ` ? ) `
                            sqlParam.push(query[key])
                        }
                        sqlSelect.push(notInSql)
                        continue
                    default:
                        sqlSelect.push(` ${param} = ? `)
                        sqlParam.push(`${query[key]}`)
                }
            }
        }

        if (sqlSelect.length > 0) {
            sql += 'where '
            sql += sqlSelect.join('and')
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
        sort += ' order by '

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

        limit += ' limit ?, ? '

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
        let sqlSelect = []
        for (const key in query) {
            if (key !== 'sort'
                && key !== 'page'
                && key !== 'size') {
                let [param , endStr] = key.split('-')

                switch (endStr) {
                    case 'like':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`%${query[key]}%`)
                        continue
                    case 'llike':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`${query[key]}%`)
                        continue
                    case 'rlike':
                        sqlSelect.push(` ${param} like ? `)
                        sqlParam.push(`%${query[key]}`)
                        continue
                    case 'left':
                        sqlSelect.push(` ${param} > ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'lefte':
                        sqlSelect.push(` ${param} >= ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'right':
                        sqlSelect.push(` ${param} <= ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'righte':
                        ssqlSelect.push(` ${param} < ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'not':
                        sqlSelect.push(` ${param} != ? `)
                        sqlParam.push(`${query[key]}`)
                        continue
                    case 'in':
                        let inSql = ` ${param} in ( `

                        if (Array.isArray(query[key])) {
                            for (let i = 0; i < query[key].length; i++) {
                                inSql += ` ?,`
                                sqlParam.push(query[key][i])
                            }
                            inSql = inSql.slice(0, inSql.length-1)
                            inSql += ` ) `
                        } else {
                            inSql += ` ? ) `
                            sqlParam.push(query[key])
                        }
                        sqlSelect.push(inSql)
                        continue
                    case 'notin':
                        let notInSql = ` ${param} not in ( `

                        if (Array.isArray(query[key])) {
                            for (let i = 0; i < query[key].length; i++) {
                                notInSql += ` ?,`
                                sqlParam.push(query[key][i])
                            }
                            notInSql = notInSql.slice(0, notInSql.length-1)
                            notInSql += ` ) `
                        } else {
                            notInSql += ` ? ) `
                            sqlParam.push(query[key])
                        }
                        sqlSelect.push(notInSql)
                        continue
                    default:
                        sqlSelect.push(` ${param} = ? `)
                        sqlParam.push(`${query[key]}`)
                }
            }
        }

        if (sqlSelect.length > 0) {
            sql += 'where '
            sql += sqlSelect.join('and')
        }
    }

    try {
        let [[total]] = await dbConn.query(countPrefix + sql, sqlParam)

        return total
    } catch (err) {
        throw err
    }
}

exports.model = async (tableName) => {
    let sql = `select * from information_schema.COLUMNS where TABLE_SCHEMA = 'test' and TABLE_NAME = ?`

    let [res] = await dbConn.query(sql, tableName)

    return res
}


exports.allTables = async () => {
    let sql = `show tables`

    let [res] = await dbConn.query(sql)

    return res
}

