
const fs=require('fs')
const express =require("express")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

app.use(bodyParser.json())
var contestSchema=mongoose.Schema({
    title: String,
    topic: String,
    difficulty: String,
    numberOfQuestions: Number,
    time: String,
    duration: Number,
    entryFee: Number,
    price:Number,
    questions: Object,
    participants: Object
})

var contestObjModel=new mongoose.model('contestObjModel',contestSchema);

mongoose.connect('mongodb+srv://yadvendras20:abcd1234@cluster0.qw0zi6d.mongodb.net/?retryWrites=true&w=majority').then(e=>{
    console.log("success")
}).catch(err=>{
    console.log(err)
})



app.get("/",async(req,res)=>{
    var data=await contestObjModel.find({})
    res.json({result:data})
})


app.post('/send',async(req,res)=>{
    console.log(req.body)
    var newObj=new contestObjModel(req.body);
    await newObj.save()
    res.json({result:"success"})
})




app.listen(3000)