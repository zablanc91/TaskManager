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

    //only get tasks that belong to the user, have options on URL query string
    //GET /tasks?completed={}
    //GET /tasks?limit={}&skip={}
    //GET /tasks?sortBy=completed:desc_createdAt:desc
    app.get('/tasks', validateAuth , async (req, res) => {
        try{
            let taskQuery;
            if(req.query.completed){
                taskQuery = {
                    completed: req.query.completed,
                    owner: req.user._id
                };
            }
            else {
                taskQuery = {
                    owner: req.user._id
                }; 
            }

            //sortBy options are key:value and separated by underscore, 1 = asc, -1 = desc
            let sortQuery = {};
            if(req.query.sortBy){
                let parts = req.query.sortBy.split('_');
                parts.forEach(part => {
                    partOption = part.split(':');
                    sortQuery[partOption[0]] = partOption[1] === 'desc' ? -1 : 1;
                });
            }

            const tasks =  await Task.find(taskQuery).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sortQuery);
            if(!tasks){
                res.status(404).send();
            }
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

    app.patch('/tasks/:id', validateId, validateAuth, async (req, res) => {
        //throw error if update attempted on nonvalid field for model
        const allowedUpdates = ['description', 'completed'];
        const updates = Object.keys(req.body);

        for (update of updates) {
            if(!allowedUpdates.includes(update)){
                return res.status(400).send({error: `${update} is an invalid field`});
            }
        }

        try {
            const updatedTask = await Task.findOne({_id: req.params.id, owner: req.user._id});
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