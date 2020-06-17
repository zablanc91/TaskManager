const User = require('../models/User');
const validateId = require('../middleware/validateId');

module.exports = (app) => {
    //create new User
    app.post('/users', async (req, res) => {
        try {
            const {name, age, email, password} = req.body;
            const newUser = await new User({ name, age, email, password}).save();
            res.status(201).send(newUser);
        }
        catch(error) {
            res.status(400).send(error);
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
                 break;
             }
         }

         try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if(!updatedUser){
                return res.status(404).send();
            }

            res.send(updatedUser);
         }
         catch(error) {
             res.status(500).send(error);
         }
    });
};