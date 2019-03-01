const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { MD5_SUFFIX, secretKey } = require('../config');
const { md5 } = require('../utils/md5');

exports.user_list = (req, res, next) => {
    User.find({}).exec(function(err, list) {
        if (err) { return next(err); }
        res.json(list);
    })
}

exports.user_login = (req, res, next) => {
    const tokenObj = {
        username: req.body.username
    };

    User.findOne({
        username: req.body.username,
        password: md5(req.body.password + MD5_SUFFIX)
    }).exec(function(err, user) {
        if (err) {
            return next(err);
        }
        if (user !== null) {
            let token = jwt.sign(tokenObj, secretKey, {
                expiresIn: 60
            });
            res.json({
                code: 0,
                message: 'success',
                token: token
            });
        } else {
            res.json({
                code: 1,
                message: '用户名或密码不正确'
            });
        }
    });
};

exports.user_register = (req, res, next) => {
    User.findOne({ username: req.body.username }).exec(function(err, user) {
        if (err) {
            return next(err);
        }
        if (user === null) {
            const registerUser = new User({
                username: req.body.username,
                password: md5(req.body.password + MD5_SUFFIX)
            });
            registerUser.save(function(err) {
                if (err) {
                    res.json({ code: 1, message: '用户名注册失败' });
                } else {
                    res.json({ code: 0, message: '用户名注册成功' });
                }
            });
        } else {
            res.json({ code: 1, message: '用户名已存在' });
        }
    });
};
