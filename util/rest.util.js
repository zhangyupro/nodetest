exports.ok = (data, msg, code) => {

    if (!msg) {
        msg = '请求成功'
    }

    if (!code) {
        code = 1
    }


    return {
        code: code,
        msg: msg,
        data: data
    }
}

exports.err = (data, msg, code) => {
    if (!msg) {
        msg = '请求失败'
    }

    if (!code) {
        code = 1
    }

    return {
        code: code,
        msg: msg,
        data: data
    }
}