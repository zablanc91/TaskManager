const mongoose = require('mongoose');

//check to see if case if id in URL isn't proper (lengthwise), use in GET or PATCH
module.exports = (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({error: 'id is invalid'});
    }
    else {
        next();
    }
}