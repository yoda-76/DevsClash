
const fs=require('fs')
const cors=require("cors")
const express =require("express")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const pythonshell=require("python-shell").PythonShell


app.use(bodyParser.json())
app.use(cors())
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

app.post("/python",(req,res)=>{
    console.log(req.body.code)
    fs.writeFileSync('test.py', req.body.code);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        // args: [1,2,3]
      };
      
      pythonshell.run('test.py', options).then(messages=>{
        // results is an array consisting of messages collected during execution
        console.log('results: %j', messages);
        res.json({msg:messages})
      });    
})



app.listen(3000)