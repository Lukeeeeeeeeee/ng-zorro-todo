const express = require('express');

const user = require('./user');
const jwtAuth = require('../middlewares/jwt');

const router = express.Router();

router.use(jwtAuth);

router.use('/', user);

// 处理 404
router.use((req, res, next) => {
    let err = new Error('Not found');
    err.status = 404;
    next(err);
});

// 处理 token 过期或失效
// 处理 5xx 错误
router.use((err, req, res, next) => {
    // jwt 中 token 失效或者过期，status 为 401，name 为 UnauthorizedError
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            message: 'token 过期',
            error: err
        });
    } else {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    }
});

module.exports = router;
