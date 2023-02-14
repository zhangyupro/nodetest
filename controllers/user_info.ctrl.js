const tableName = 'user_info'
const rest = require('../util/rest.util')
const commonDb = require('../db/commondb.v2')
const {setGroupName} = require("./work_group.ctrl");
const axios = require("axios");
const commonCtrl = require("./common.ctrl");

exports.register = (user) => {

    if (!user.username) {
        return rest.err(false, '用户名不能为空', 50001)
    }
    if (!user.password) {
        return rest.err(false, '密码不能为空', 50002)
    }

    let count = commonDb.count(tableName, {username:user.username})
    if (count > 0) {
        return rest.err(false, '当前用户名已存在', 50003)
    }

    let ok = commonDb.insert(user, tableName)
    if (ok) {
        return rest.ok(true, '注册成功')
    } else {
        return rest.err(false, '注册失败')
    }
}

const doSelectListAfter = async (array) => {
    await setGroupName(array)
}

exports.syncWxData = async () => {
    const CORP_ID = "wx00135e899ce6d8b2";
    const CORP_SECRET = "nHqQKWV1572a1Lap0Hn7OZ4wWj5WI25v-iQXwhouXQc";
    const department_id = "1";
    try {
        const res = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`)
        const access_token = res.data.access_token
        const user = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${access_token}&department_id=${department_id}`)
        const userList = user.data.userlist
        const oldUserListRes = await commonCtrl.selectList('user_info')
        const oldUserList = oldUserListRes.content
        let oldUserMap = new Map()

        for (let i = 0; i < oldUserList.length; i++) {
            let userItem = oldUserList[i]
            oldUserMap.set(userItem.id, {
                id: userItem.id,
                name: userItem.name,
                mobile: userItem.mobile,
                gender: userItem.gender,
                email: userItem.email,
                avatar: userItem.avatar
            })
        }

        for (let i = 0; i < userList.length; i++) {
            let userItem = userList[i]

            if (!oldUserMap.has(userItem.userid)) {
                let resItem = await commonCtrl.insert({
                    id: userItem.userid,
                    name: userItem.name,
                    mobile: userItem.mobile,
                    gender: userItem.gender,
                    email: userItem.email,
                    avatar: userItem.avatar,
                }, 'user_info')
                if (resItem) {
                    console.log(`${new Date()}--success--wechat.user.job--共 ${userList.length} 条--第 ${i + 1} 条--插入数据：` + userItem.userid + `------`)
                } else {
                    console.log(`${new Date()}--fail--wechat.user.job--共 ${userList.length} 条--第 ${i + 1} 条--插入数据：` + userItem.userid + `------`)
                }
                oldUserMap.delete(userItem.userid)
            } else {
                let isChanged = false;
                let oldUserItem = oldUserMap.get(userItem.userid)

                for (const key in oldUserItem) {
                    if (userItem.hasOwnProperty(key)
                        && oldUserItem[key] + '' !== userItem[key] + '') {
                        isChanged = true
                        break
                    }
                }

                if (isChanged) {
                    let resItem = await commonCtrl.updateById(userItem.userid,{
                        name: userItem.name,
                        mobile: userItem.mobile,
                        gender: userItem.gender,
                        email: userItem.email,
                        avatar: userItem.avatar
                    }, 'user_info')
                    if (resItem) {
                        console.log(`${new Date()}--success--wechat.user.job--共 ${userList.length} 条--第 ${i + 1} 条--更新数据：` + userItem.userid + `------`)
                    } else {
                        console.log(`${new Date()}--fail--wechat.user.job--共 ${userList.length} 条--第 ${i + 1} 条--更新数据：` + userItem.userid + `------`)
                    }

                } else {
                    console.log(`${new Date()}--success--wechat.user.job--共 ${userList.length} 条--第 ${i + 1} 条--无变动：` + userItem.userid + `------`)
                }

                oldUserMap.delete(userItem.userid)
            }
        }

        let deleteArr = oldUserMap.values()
        let deleteItem = deleteArr.next()
        while (!deleteItem.done) {
            let userItem = deleteItem.value
            let resItem = await commonCtrl.deleteById(userItem.id, `user_info`)

            if (resItem) {
                console.log(`${new Date()}--success--wechat.user.job--共 ${userList.length} 条--第 1 条--删除数据：` + userItem.id + `------`)
            } else {
                console.log(`${new Date()}--fail--wechat.user.job--共 ${userList.length} 条--第 1 条--删除数据：` + userItem.id + `------`)
            }

            deleteItem = deleteArr.next()
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = {doSelectListAfter}