const User = require('../models/User');
const Task = require('../models/Task');
const validateAuth = require('../middleware/validateAuth');
const multer = require('multer');
const sharp = require('sharp');

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

    //multer file upload - restrict max file size to 1MB
    //file data is added to req.file after this middleware
    const uploadAvatar = multer({
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, next) {
            const isPhoto = file.mimetype.startsWith('image/');
            if(isPhoto) {
                return next(null, true);
            }
            
            next({message: 'Invalid file type, use an image.'});
        }
    });

    //middleware using sharp to format image after upload, resize and make png
    const formatImage = async (req, res, next) => {
        const buffer = await sharp(req.file.buffer).resize({width: 300, height:300}).png().toBuffer();
        req.buffer = buffer;
        next();
    };

    //upload user profile, key in POST req is provided to upload and value is the file
    app.post('/users/profile/avatar', validateAuth, uploadAvatar.single('avatar'), formatImage, async (req, res) => {
        try {
            req.user.avatar = req.buffer;
            await req.user.save();
            res.send();
        }
        catch(error) {
            res.status(500).send(error);
        }    
    }, (error, req, res, next) => {
        //error handler for errors from multer/sharp
        res.status(400).send({error: error.message});
    });

    app.delete('/users/profile/avatar', validateAuth, async (req, res) => {
        try {
            req.user.avatar = undefined;
            await req.user.save();
            res.send();
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    //retrieve User avatar image through GET req to url
    app.get('/users/:id/avatar', async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            if(!user || !user.avatar){
                throw new Error;
            }

            //set response header - avatars are pngs
            res.set('Content-Type', 'image/png').send(user.avatar);
        }
        catch(error){
            res.status(404).send();
        }
    });
};