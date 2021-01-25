const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = mongoose.model("User");
const {JWT_SECRET_KEY} =require("../keys")
const requirelogin = require("../middleware/requirelogin")
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
// const {EMAIL}=require("../keys")



// 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

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
      api_key:"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"
  }
}))

router.post("/signup", (req, res) => {
  const { name, email, password,pic } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "Please add all the required fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists!" });
      }
      bcrypt.hash(password, 12).then((hashedpasswords) => {
        const user = new User({
          email,
          password:hashedpasswords,
          name,
          pic
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "User saved Successfully!!" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post("/signin",(req, res) => {
    const {email,password}=req.body
    if (!email,!password){
        res.status(422).json({error:"Please add email and password "})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(matched =>{
            if(matched){
                // res.json({message:"Logged In"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET_KEY)
                const {_id,name,email,followers,following,pic}=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Password"})  
            }
        })
        .catch(err =>{
            console.log(err)
        })
    });
});

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dosen't exists with that email"})
          }
          user.resetToken = token
          user.expireToken = Date.now() + 3600000
          user.save().then((result)=>{
              transporter.sendMail({
                  to:user.email,
                  from:"no-replay@newinstagram.com",
                  subject:"password-reset",
                  html:`
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:3000/resetpassword/${token}">link</a> to reset password</h5>
                  `
              })
              res.json({message:"check your email"})
          })

      })
  })
})



router.post("/new-password",(req,res) => {
  const newPassword = req.body.password 
  const sentToken = req.body.token 
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user => {
    if (!user){
      return res.status(422).json({error:"Try Again Session Expired"})
    }
    bcrypt.hash(newPassword,12).then(hashedpassword => {
      user.password = hashedpassword
      user.resetToken = undefined 
      user.expireToken = undefined 
      user.save().then((saveduser)=>{
        res.json({message:"Password Updated"})
      })
    })
  }).catch(err => {
    console.log(err)
  })
})
module.exports = router;
