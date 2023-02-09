const tableName = "work_group";
const commonDB = require("../db/commondb.v2");

exports.setGroupName = async (array) => {
  await array.content.forEach(async (e) => {
    if (e.hasOwnProperty("group_id")) {
      e.work_group = await commonDB.selectById(e.group_id, tableName);
    }
  });

  // for (let i = 0; i < array.total; i++) {
  //     if (array.content[i].hasOwnProperty('group_id')) {
  //         console.log(array.content[i])
  //         array.content[i].work_group = await commonDB.selectById(array.content[i].group_id , tableName)
  //     }
  // }
};
