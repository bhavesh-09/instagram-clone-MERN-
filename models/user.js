const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    
    pic:{
        type:String,
        default:"https://res.cloudinary.com/bhavesh9cloud/image/upload/v1611478243/Z0A5715-scaled_vqu6n6.jpg"
        

    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]

}) 

mongoose.model('User',userSchema)