const axios = require('axios');
const commonCtrl = require('../controllers/common.ctrl')

const getWxData = async () => {
    const CORP_ID = "wx00135e899ce6d8b2";
    const CORP_SECRET = "nHqQKWV1572a1Lap0Hn7OZ4wWj5WI25v-iQXwhouXQc";
    const department_id = "1";
    try {
        const res = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`)
        const access_token = res.data.access_token
        const user = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${access_token}&department_id=${department_id}`)
        const userList = user.data.userlist

        const oldUserList = await commonCtrl.selectList('user_info')
        let userMap = new Map()
        oldUserList.forEach((userItem) => {
            userMap.set(userItem.userid, {
                name: userItem.name,
                mobile: userItem.mobile,
                gender: userItem.gender,
                email: userItem.email,
                avatar: userItem.avatar,
                userid: userItem.userid
            })
        })

        for (let i = 0; i < userList.length; i++) {
            let change = false
            let userItem = userList[i]
            let name = userItem.name.in
            let resItem = await commonCtrl.insert({
                name: userItem.name,
                mobile: userItem.mobile,
                gender: userItem.gender,
                email: userItem.email,
                avatar: userItem.avatar,
                userid: userItem.userid
            }, 'user_info')

            if (i === 10) {
                console.log(resItem)
            }

            if (change) {
                console.log(`第${i}条数据导入成功  `, `还有${userList.length - i}条数据待处理`)
            } else {

            }
        }

        return userList
    } catch (err) {
        console.log(err);
    }
}

getWxData()
module.exports = getWxData