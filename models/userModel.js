const { timeStamp } = require('console')
const mongoose = require('mongoose')
const { type } = require('os')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'name is required']
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
},
{timeStamp: true}
)

const userModel = mongoose.model('users', userSchema)

module.exports = mongoose.model('user', userSchema);