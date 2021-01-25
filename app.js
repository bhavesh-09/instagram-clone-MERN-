const express=require('express');
const app= express();
const mongoose = require('mongoose')
const PORT= 7000


// Connect to Mongo
mongoose.connect("mongodb://localhost:27017/instagramdb", {useFindAndModify:false,useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log('Database error:', err))

require("./models/user")
require("./models/post")

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

app.get("/",(req,res)=>{
    res.send("helloo")
});

app.get("/about",(req,res)=>{
    res.send("about")
});

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
});
