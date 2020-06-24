const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config/keys');
const Task = require('../models/Task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number.');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('The provided email is not valid.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(validator.contains(value.toLowerCase(), 'password')){
                throw new Error("Your password cannot contain 'password'.");
            }
        }
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }]
}, { timestamps: true});

//generate token on create or login, then save
userSchema.methods.generateToken =  async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, tokenSecret);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

//when sending user through res, JSON.stringify(user) is called behind scenes and toJSON will also be called
//turn document to object and get rid of password and tokens to protect user info
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};


//custom method for logging in a User
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to log in.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to log in.');
    }

    return user;  
}

//middleware to hash password when User is created or changed on edit, use before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')){
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
    }      
    next();
});

//after deleting a User, make sure to delete all tasks made by them
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;