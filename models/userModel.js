// const { timeStamp } = require('console')
// const mongoose = require('mongoose')
// const { type } = require('os')

// const userSchema = new mongoose.Schema({
//     username:{
//         type:String,
//         required:[true, 'name is required']
//     },
//     email:{
//         type:String,
//         unique:true,
//         required:[true, 'email is required']
//     },
//     password:{
//         type:String,
//         required:[true,'password is required']
//     },
// },
// {timeStamp: true}
// )

// const userModel = mongoose.model('users', userSchema)

// module.exports = mongoose.model('user', userSchema);


const { timeStamp } = require('console')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true })

// ... existing pre-save hook and comparePassword method ...

const userModel = mongoose.model('User', userSchema)

module.exports = userModel