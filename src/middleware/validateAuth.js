const jwst = require('jsonwebtoken');
const { tokenSecret } = require('../config/keys');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    //token sent in as part of Authorization header in request
    //need to get payload of token (id) and get the User that it belongs to
    try {
        const token = req.header('Authorization').split(' ')[1];
        const payloadId = jwst.decode(token, tokenSecret);
        const user = await User.findOne({
            _id: payloadId,
            'tokens.token': token
        });

        if(!user){
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch(error) {
        res.status(401).send({error: 'Please verify authentication.'});
    }
}