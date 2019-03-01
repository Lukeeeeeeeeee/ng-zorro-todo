const expressJwt = require('express-jwt');
const { secretKey } = require('../config');

const jwtAuth = expressJwt({
    secret: secretKey,
    credentialsRequired: true
}).unless({
    path: ["/api/login", "/api/register"]
});

module.exports = jwtAuth;