const Entity = require('./common.model')

class UserInfo extends Entity{
    constructor(userInfo) {
        super(userInfo);

        this.password = userInfo.password
        this.username = userInfo.username
    }
}

module.exports = UserInfo

