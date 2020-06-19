const User = require('../models/User');
const validateId = require('../middleware/validateId');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    //create new User
    app.post('/users', async (req, res) => {
        try {
            const newUser = await new User(req.body).save();
            res.status(201).send(newUser);
        }
        catch(error) {
            res.status(400).send(error);
        }
    });

    //logging in, use custom method to verify email and password
    app.post('/users/login', async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            res.send(user);
        }
        catch(error) {
            res.status(400).send();
        }
    });

    app.get('/users', async (req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.get('/users/:id', validateId, async (req, res) => {
        try {
            const retrievedUser = await User.findById(req.params.id);
            if(!retrievedUser) {
                return res.status(404).send();
            }
            res.send(retrievedUser);
        }
        catch(error){
            res.status(500).send(error);
        }
    });

    app.patch('/users/:id', validateId, async (req, res) => {
         //throw error if update attempted on nonvalid field for model
         const allowedUpdates = ['name', 'email', 'password', 'age'];
         const updates = Object.keys(req.body);
 
         for (update of updates) {
             if(!allowedUpdates.includes(update)){
                 return res.status(400).send({error: `${update} is an invalid field`});
             }
         }

         try {
             const updatedUser = await User.findById(req.params.id);

            if(!updatedUser){
                return res.status(404).send();
            }

            updates.forEach((update) => {
                updatedUser[update] = req.body[update];
            });

            await updatedUser.save();

            res.send(updatedUser);
         }
         catch(error) {
             res.status(500).send(error);
         }
    });

    app.delete('/users/all', async (req, res) => {
        try {
            const result = await User.deleteMany({});
            console.log(result);
            res.send(result);
        }
        catch(error) {
            res.status(400).send();
        }
    });

    app.delete('/users/:id', validateId, async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if(!deletedUser){
                res.status(404).send();
            }
            res.send(deletedUser);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

};