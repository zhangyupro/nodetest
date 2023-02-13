const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const map = new Map();

exports.getQrcode = async (req, res) => {
    const token = uuidv4();
    res.send({ token });
};

exports.check = async (req, res) => {
    const { token } = req.query;

    map.set(token, res);

    setTimeout(() => map.delete(token), 1000 * 300);
};

exports.getUserInfo = async (req, res) => {
    const { userinfo, token } = req.body;
    const tokenStr = jwt.sign(userinfo, config.jwtSecretKey, {
        expiresIn: "10h",
    });
    userinfo.tokenStr = "Bearer " + tokenStr;
    const response = map.get(token);
    if (response) {
        response.send(userinfo);
        map.delete(token);
    }
    res.send({ msg: "success" });
};
