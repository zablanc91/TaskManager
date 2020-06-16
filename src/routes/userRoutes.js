const User = require('../models/User');

module.exports = (app) => {
    //create new User
    app.post('/users', (req, res) => {
        const {name, age, email, password} = req.body;
        const newUser = new User({ name, age, email, password});

        newUser.save()
            .then(() => {
                res.status(201).send(newUser);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        }
        catch(error) {
            res.status(400).send(error);
        }
    });

    app.get('/users/:id', async (req, res) => {
        try {
            const retrievedUser = await User.findById(req.params.id);
            res.send(retrievedUser);
        }
        catch(error){
            res.status(400).send(error);
        }
    });
};