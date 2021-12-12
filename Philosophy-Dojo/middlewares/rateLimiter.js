const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000, //one minute time window
    max: 6,
    handler: (req, res, next) => {
        let err = new Error('Too many login request. Try again later');
        err.status = 429;
        return next(err);
    }
});