const Task = require('../models/Task');

module.exports = (app) => {
    //create new Task
    app.post('/tasks', (req, res) => {
        const {description, completed} = req.body;
        const newTask = new Task({ description, completed});

        newTask.save()
            .then(() => {
                res.status(201).send(newTask);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    });

    app.get('/tasks', async (req, res) => {
        try{
            const tasks =  await Task.find();
            res.send(tasks);
        }
        catch(error){
            res.status(400).send(error);
        }
    });

    app.get('/tasks/:id', async (req, res) => {
        try {
            const retrievedTask = await Task.findById(req.params.id);
            res.send(retrievedTask);
        }
        catch(error) {
            res.status(400).send(error);
        }   
    });
};