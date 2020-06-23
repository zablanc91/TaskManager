const Task = require('../models/Task');
const validateId = require('../middleware/validateId');
const validateAuth = require('../middleware/validateAuth');

module.exports = (app) => {
    //create new Task
    app.post('/tasks', validateAuth, async (req, res) => {
        try {
            const newTask = await new Task({ ...req.body, owner: req.user._id }).save();
            res.status(201).send(newTask);
        }
        catch(error) {
            res.status(400).send(error);
        }
    });

    //only get tasks that belong to the user
    app.get('/tasks', validateAuth , async (req, res) => {
        try{
            const tasks =  await Task.find({owner: req.user._id});
            res.send(tasks);
        }
        catch(error){
            res.status(500).send(error);
        }
    });

    app.get('/tasks/:id', validateId, validateAuth, async (req, res) => {
        try {
            const retrievedTask = await Task.findOne({_id: req.params.id, owner: req.user._id});
            if(!retrievedTask) {
                return res.status(404).send();
            }
            res.send(retrievedTask);
        }
        catch(error) {
            res.status(500).send(error);
        }   
    });

    app.patch('/tasks/:id', validateId, async (req, res) => {
        //throw error if update attempted on nonvalid field for model
        const allowedUpdates = ['description', 'completed'];
        const updates = Object.keys(req.body);

        for (update of updates) {
            if(!allowedUpdates.includes(update)){
                return res.status(400).send({error: `${update} is an invalid field`});
            }
        }

        try {
            const updatedTask = await Task.findOne({_id: req.params.id, owner: req.user_id});
        
            if(!updatedTask) {
                return res.status(404).send();
            }

            updates.forEach(update => updatedTask[update] = req.body[update]);
            await updatedTask.save();
            res.send(updatedTask);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.delete('/tasks/all', validateAuth, async (req, res) => {
        try {
            const result = await Task.deleteMany({owner: req.user._id});
            res.send(result);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.delete('/tasks/:id', validateId, validateAuth, async (req, res) => {
        try {
            const deletedTask = await Task.deleteOne({_id: req.params.id, owner: req.user._id});
            if(!deletedTask){
                return res.status(404).send();
            }
            res.send(deletedTask);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

};