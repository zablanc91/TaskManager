const Task = require('../models/Task');
const validateId = require("../middleware/validateId");

module.exports = (app) => {
    //create new Task
    app.post('/tasks', async (req, res) => {
        try {
            const {description, completed} = req.body;
            const newTask = await new Task({ description, completed}).save();
            res.status(201).send(newTask);
        }
        catch(error) {
            res.status(400).send(error);
        }
    });

    //TODO later: only get tasks that belong to the user
    app.get('/tasks', async (req, res) => {
        try{
            const tasks =  await Task.find();
            res.send(tasks);
        }
        catch(error){
            res.status(500).send(error);
        }
    });

    //TODO later: check to make sure the task belongs to the user
    app.get('/tasks/:id', validateId , async (req, res) => {
        try {
            const retrievedTask = await Task.findById(req.params.id);
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
            //options object: new to true so it returns the updated document
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if(!updatedTask) {
                return res.status(404).send();
            }
            
            res.send(updatedTask);
        }
        catch(error) {
            res.status(500).send(error);
        }
    });

    app.delete('/tasks/:id', validateId, async (req, res) => {
        try {
            const deletedTask = await Task.findByIdAndDelete(req.params.id);
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