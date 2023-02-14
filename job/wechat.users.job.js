const userCtrl = require('../controllers/user_info.ctrl')

const syncWechatUserData = async () => {
    await userCtrl.syncWxData()
}

const jobArr = [
    {
        work_name: 'syncWechatUserData',
        cron: '0 0 1 * * ?'
    }
]

module.exports = {jobArr}