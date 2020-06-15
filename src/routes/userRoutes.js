const User = require('../models/User');

module.exports = (app) => {
    //create new User
    app.post('/users', (req, res) => {
        const {name, age, email, password} = req.body;
        const newUser = new User({ name, age, email, password});

        newUser.save()
            .then(() => {
                res.send(newUser);
            })
            .catch((error) => console.log('Error: ', error));
    });

    app.get('/users', (req, res) => {
        console.log('getting user');
    });
};