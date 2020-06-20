const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config/keys');

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
});

//instance method to generate token with id, may need to be async?
userSchema.methods.generateToken =  async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, tokenSecret);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

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


const User = mongoose.model('User', userSchema);

module.exports = User;