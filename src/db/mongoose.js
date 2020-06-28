const mongoose = require('mongoose');
const { mongooseConnect } = require('../config/keys');



//connecting to MongoDB - localhost for dev, mongoDB cluster for prod
mongoose.connect( mongooseConnect , {
    useNewUrlParser: true,
    useCreateIndex: true
    })
    .then(() => console.log('Connected to MongoDB with mongoose.'))
    .catch(error => console.log('Error:', error));