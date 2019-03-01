const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes/index');
const { mongoDB } = require('./config');

// 设置默认 mongoose 连接
mongoose.connect(mongoDB, { useNewUrlParser: true });
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;

db.on('error', console.error.bind(console, '连接错误：'));
db.on('open', callback => {
    console.log('MongoDB 连接成功!!!');
});

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(3004, () => {
    console.log('node server is listening 3004');
});
