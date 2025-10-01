const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    }
    ,
    password:{
        type: String,
    }
},
    {
        timestamps: true
    }
)

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;

