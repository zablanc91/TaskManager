const Task = require('../models/Task');

module.exports = (app) => {
    //create new Task
    app.post('/tasks', (req, res) => {
        const {description, completed} = req.body;
        const newTask = new Task({ description, completed});

        newTask.save()
            .then(() => {
                res.send(newTask);
            })
            .catch((error) => console.log('Error: ', error));
    });

    app.get('/tasks', (req, res) => {
        console.log('Inside get task');
    });
};