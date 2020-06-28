//set @ Heroku
module.exports = {
    tokenSecret: process.env.TOKEN_SECRET,
    sendGridKey: process.env.SENDGRID_API,
    mongooseConnect: process.env.MONGOOSE_CONNECT
};