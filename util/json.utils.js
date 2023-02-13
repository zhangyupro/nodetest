const fs=require('fs')
const {model, allTables} = require("../db/commondb.v2");

// writeFile()可以接收四个参数，第一个是路径，第二个是文件内容，
//第三个可选项代表权限，第四个是回调函数。这里第三个参数通常省略
let data={
    name:"张三",
    tel:'1008611',
    age:"18"
}
//
// //将javascript对象转换为json字符串
// data = JSON.stringify(data, undefined, 4);
// fs.writeFile('./js/test1.json',data,err=>{
//     if(err){
//         console.log('写入出错了');
//     }else{
//         console.log('文件写入成功');
//     }
// })


const tableStruct = async function (tableName) {
    //rows是个从数据库里面读出来的数组，大家就把他当成一个普通的数组就ok
    let data = new Map()
    let colum = await model(tableName)
    colum.forEach((element) => {
        data.set(element.COLUMN_NAME, "")
    });
    console.log(data)
    let obj= Object.create(null);
    for (let[k,v] of data) {
        obj[k] = v;
    }

    let result = JSON.stringify(obj);

    console.log(result)

    //将javascript对象转换为json字符串

    fs.writeFileSync(`../sql/model/${tableName}.json`,result)
}
tableStruct('media')

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

