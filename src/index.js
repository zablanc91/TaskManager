const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//services
require('./db/mongoose');

//load in Models -- not needed since we export ?
require('./models/User');
require('./models/Task');

//parse incoming JSON to an object, access in req.body
app.use(express.json());

//routes
require('./routes/userRoutes')(app);
require('./routes/taskRoutes')(app);

app.listen(port, () => {
    console.log('Server is online at port', port);
});