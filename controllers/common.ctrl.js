const commonDb = require('../db/commondb.v2')

exports.insert = async (body, tableName) => {
    return await commonDb.insert(body, tableName)
}

exports.updateById = async (id, body, tableName) => {
    return await commonDb.updateById(id, body, tableName)
}

exports.deleteById = async (id, tableName) => {
    return await commonDb.deleteById(id, tableName)
}

exports.selectById = async (id, tableName) => {
    return await commonDb.selectById(id, tableName)
}

exports.selectList = async (tableName, query) => {
    return await commonDb.readList(tableName, query)
}

exports.count = async (tableName, query) => {
    return await commonDb.count(tableName, query)
}