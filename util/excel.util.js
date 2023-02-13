const xlsx = require('node-xlsx')//引入模块
const fs = require('fs')
const {model, allTables} = require("../db/commondb.v2");

const tableStruct = async function (tableName) {
    //rows是个从数据库里面读出来的数组，大家就把他当成一个普通的数组就ok
    let data = [[tableName]] // 其实最后就是把这个数组写入excel
    let title = ['列名','类型','是否自增','是否主键','备注']//这是第一行 俗称列名
    let colum = await model(tableName)
    data.push(title) // 添加完列名 下面就是添加真正的内容了
    colum.forEach((element) => {
        let arrInner = []
        arrInner.push(element.COLUMN_NAME)
        arrInner.push(element.DATA_TYPE)
        if (element.EXTRA === 'auto_increment') {
            arrInner.push('是')
        } else {
            arrInner.push('否')
        }
        if (element.COLUMN_KEY === 'PRI') {
            arrInner.push('是')
        } else {
            arrInner.push('否')
        }
        arrInner.push(element.COLUMN_COMMENT)
        data.push(arrInner)//data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
    });
    data.push([''])

    let buffer = xlsx.build([
        {
            name:'sheet1',
            data:data
        }
    ]);

    fs.writeFileSync(`../sql/model/${tableName}.xlsx`,buffer,{'flag':'w'});//生成excel the_content是excel的名字，大家可以随意命名
}

const allTableStruct = async function () {
    const colum = await allTables()

    let data = []
    for (let i = 0; i < colum.length; i++) {

        console.log(colum)
        let tableName = colum[i].Tables_in_test // 其实最后就是把这个数组写入excel
        data.push([tableName])
        data.push(['列名','类型','是否自增','是否主键','备注'])//这是第一行 俗称列名
        let res = await model(tableName)
        res.forEach((element) => {
            let arrInner = []
            arrInner.push(element.COLUMN_NAME)
            arrInner.push(element.DATA_TYPE)
            if (element.EXTRA === 'auto_increment') {
                arrInner.push('是')
            } else {
                arrInner.push('否')
            }
            if (element.COLUMN_KEY === 'PRI') {
                arrInner.push('是')
            } else {
                arrInner.push('否')
            }
            arrInner.push(element.COLUMN_COMMENT)
            data.push(arrInner)//data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
        });
        data.push([''])
    }

    let buffer = xlsx.build([
        {
            name:'sheet1',
            data:data
        }
    ]);

    fs.writeFileSync(`../sql/model/all_table.xlsx`,buffer,{'flag':'w'});//生成excel the_content是excel的名字，大家可以随意命名
}
allTableStruct()
