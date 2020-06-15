const mongoose = require('mongoose');

//connecting to MongoDB - 127 IP is localhost
mongoose.connect('mongodb://127.0.0.1:27017/TaskManagerAPI', {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => console.log('Connected to MongoDB with mongoose.'))
.catch(error => console.log('Error:', error));