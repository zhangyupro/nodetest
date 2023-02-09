const commonDb = require('../db/commondb.v2')

exports.insert = async (body, tableName) => {
    const data = require(`../controllers/${tableName}.ctrl`)

    if (data.hasOwnProperty('doInsertBefore')) {
        await data.doInsertBefore(body)
    }

    let result = await commonDb.insert(body, tableName)

    if (data.hasOwnProperty('doInsertAfter')) {
        await data.doInsertAfter(body, result)
    }

    return result
}

exports.updateById = async (id, body, tableName) => {
    const data = require(`../controllers/${tableName}.ctrl`)

    if (data.hasOwnProperty('doUpdateBefore')) {
        await data.doUpdateBefore(body)
    }

    let result = await commonDb.updateById(body, tableName)

    if (data.hasOwnProperty('doUpdateAfter')) {
        await data.doUpdateAfter(body, result)
    }

    return result
}

exports.deleteById = async (id, tableName) => {
    const data = require(`../controllers/${tableName}.ctrl`)

    if (data.hasOwnProperty('doDeleteBefore')) {
        await data.doDeleteBefore(id)
    }

    let result = await commonDb.deleteById(id, tableName)

    if (data.hasOwnProperty('doDeleteAfter')) {
        await data.doDeleteAfter(result)
    }

    return result
}

exports.selectById = async (id, tableName) => {
    const data = require(`../controllers/${tableName}.ctrl`)

    if (data.hasOwnProperty('doSelectByIdBefore')) {
        await data.doSelectByIdBefore(id)
    }

    let result = await commonDb.selectById(id, tableName)

    if (data.hasOwnProperty('doSelectByIdAfter')) {
        await data.doSelectByIdAfter(result)
    }

    return result
}

exports.selectList = async (tableName, query) => {
    const data = require(`../controllers/${tableName}.ctrl`)

    if (data.hasOwnProperty('doSelectListBefore')) {
        await data.doSelectListBefore(query)
    }

    let result = await commonDb.readList(tableName, query)

    if (data.hasOwnProperty('doSelectListAfter')) {
       await data.doSelectListAfter(result)
    }

    return result
}

exports.count = async (tableName, query) => {
    return await commonDb.count(tableName, query)
}