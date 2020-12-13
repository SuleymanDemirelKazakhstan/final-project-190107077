var express = require('express');
var router = express.Router();
var loginRouter = require('./authorization');
router.use('/login', loginRouter);
module.exports.router = router;