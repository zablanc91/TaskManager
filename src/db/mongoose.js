const mongoose = require('mongoose');

//connecting to MongoDB - 127 IP is localhost (this is for local dev environment)
if(process.env.NODE_ENV === 'dev'){
    mongoose.connect('mongodb://127.0.0.1:27017/TaskManagerAPI', {
    useNewUrlParser: true,
    useCreateIndex: true
    })
    .then(() => console.log('Connected to MongoDB with mongoose.'))
    .catch(error => console.log('Error:', error));
}


//TODO: make an else statement to connect to MongoDB when in production environment with Heroku