const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const validateAuth = require('../middleware/validateAuth');

module.exports = (app) => {
    //create new User
    app.post('/users', async (req, res) => {
        try {
            const newUser = await new User(req.body).save();
            const token = await newUser.generateToken();
            res.status(201).send({newUser, token});
        }
        catch(error) {
            res.status(400).send(error);
        }
    });

    //logging in, use custom method to verify email and password
    //after logging out, User loses token; need to give back
    app.post('/users/login', async (req, res) => {
        try {
            //generate JSON web token
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token =  await user.generateToken();
            res.send({user, token});
        }
        catch(error) {
            res.status(400).send();
        }
    });

    //remove user's token on logout
    app.post('/users/logout', validateAuth, async(req, res) => {
        try {
            const newTokens = req.user.tokens.filter(token => token.token != req.token);
            req.user.tokens = newTokens;
            await req.user.save();
            res.send(req.user);
        }
        catch(error){
            res.status(500).send(error);
        }     
    });

    //clears out all of user's tokens after logout
    app.post('/users/logoutAll', validateAuth, async(req, res) => {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.send(req.user);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.get('/users', validateAuth, async (req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.get('/users/profile', validateAuth, async(req, res) => {
        res.send(req.user);
    });

    app.patch('/users/profile', validateAuth, async (req, res) => {
         //throw error if update attempted on nonvalid field for model
         const allowedUpdates = ['name', 'email', 'password', 'age'];
         const updates = Object.keys(req.body);
 
         for (update of updates) {
             if(!allowedUpdates.includes(update)){
                 return res.status(400).send({error: `${update} is an invalid field`});
             }
         }

         try {
            updates.forEach((update) => {
                req.user[update] = req.body[update];
            });

            await req.user.save();
            res.send(req.user);
         }
         catch(error) {
             res.status(500).send(error);
         }
    });

    app.delete('/users/all', async (req, res) => {
        try {
            const result = await User.deleteMany({});
            await Task.deleteMany({});
            console.log(result);
            res.send(result);
        }
        catch(error) {
            res.status(400).send();
        }
    });

    app.delete('/users/profile', validateAuth, async (req, res) => {
        try {
            await req.user.remove();
            res.send(req.user);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

};