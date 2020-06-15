//CRUD operations with mongoDB
const mongodb = require('mongodb');
const { MongoClient, ObjectID } = mongodb;

//initialize connection
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'TaskManager';

MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
    //run after connecting to DB
    if(error) {
        return console.log('Unable to connect to database.');
    }

    console.log('Connected to MongoDB successfully.');
    
    const db = client.db(databaseName);

    // db.collection('tasks').findOne({
    //     _id: new ObjectID('5ee18ef35880a1ddb6ed2f68')
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Error trying to with document with MongoDB.');
    //     }
    //     console.log('Successfuly found matching document: ', result);
    // })

    // db.collection('tasks').find({
    //     completed: false
    // }).project({_id: 0}).toArray((error, tasks) => {
    //     if(error){
    //         return console.log('Error, issues retrieving documents with MongoDB.');
    //     }
    //     console.log(tasks);
    // });



   
    
    // db.collection('users').insertOne({
    //     name: 'Arteezy',
    //     age: 19
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert new user.');
    //     }

    //     //ops is an array of documents that got inserted
    //     console.log(result.ops);
    // });

    // const updateUser =  db.collection('users').updateOne({name: 'Arteezy'}, {$set: {age: 21}});
    // updateUser.then(success => console.log('Successfully updated:', success)).catch(error => console.log('Error:', error));

    // const updateTasksPromise = db.collection('tasks').updateMany(
    //     {completed: true}, 
    //     {$set: {completed: false}}
    // );

    // updateTasksPromise.then((success) => {
    //     if(success.modifiedCount != 0){
    //         return console.log('Successfully updated tasks.');
    //     }
    //     console.log('No task documents were updated');
    // }).catch(error => console.log('Error:', error));

    const deleteTasksPromise = db.collection('tasks').deleteMany({completed: false});

    deleteTasksPromise
        .then((response) => { 
            if(response.deletedCount === 0){
                return console.log('No document with the matching query was found to be deleted.');
            }
            console.log('Successfully deleted:',response);
        
        })
        .catch(error => console.log('Error:', error));

});