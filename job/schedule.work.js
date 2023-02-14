const schedule = require('node-schedule')
const fs = require("fs");
const path = require("path");
const commonCtrl = require('../controllers/common.ctrl')
const whiteList = ['schedule.work.js']

const autoScheduleWork = async () => {
    schedule.scheduleJob()
    // 拿到当前文件夹下所有文件名
    const res = fs.readdirSync(path.resolve(__dirname))

    for (let i = 0; i < res.length; i++) {
        // 如果是当前auto_register.js文件则不注册
        if (whiteList.includes(res[i])) {
            continue
        }

        // 根据文件名引入文件
        const data = require(`./${res[i]}`)

        let jobArr = data.jobArr;

        if (!jobArr) {
            continue
        }

        for (const jobItem in jobArr) {
            await commonCtrl.insert({work_name:jobItem.work_name
                                            , cron: jobItem.cron
                                            , is_open: 1
                                            , work_file: res[i]} , 'schedule_work')
        }
    }
}

autoScheduleWork()