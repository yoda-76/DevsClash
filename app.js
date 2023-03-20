
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
    difficulty:String,
    duration : String,
    id: String,
    questions: Object,
    startTime:String,
    startTimeHour:String,
    startTimeMinute:String,
    startTimeSecound:String,
    topic: String,
    noOfQuestions:Number,
    participants:Object

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
    var cObj={...req.body,questions:{q1:{st:`Given a string of characters, find the length of the longest proper prefix which is also a proper suffix.
    NOTE: Prefix and suffix can be overlapping but they should not be equal to the entire string.
    
    Example 
    Input: s = "abab"
    Output: 2
    `,p:[["aaaa",3]]},q2:{st:`Given a string, find the minimum number of characters to be inserted to convert it to palindrome.
    For Example:
    ab: Number of insertions required is 1. bab or aba
    aa: Number of insertions required is 0. aa
    abcd: Number of insertions required is 3. Dcbabcd
    
    Example 
    Input: str = "abcd"
    Output: 3
    `,p:[["abcd",3]]}}}
    var newObj=new contestObjModel(cObj);
    await newObj.save()
    res.json(cObj)
})

// app.patch("/join",async(req,res)=>{
//     id=req.body.id

//     var s=await contestObjModel.updateOne({id:id},{ $set:{participants:{id:"temp-id"}}})
//     console.log(id)
//     res.json({"msg":"good"})
// })


app.patch("/join", async (req, res) => {
    try {
      const id = req.body.id;
      var data1=await contestObjModel.find({id:id})
      console.log("data1",data1[0])
      const result = await contestObjModel.updateOne(
        { id },
        { $set: { participants: [...(data1[0].participants),{id:id, solved:0}]} }
      );
      if (result.nModified === 0) {
        // If the document wasn't modified, it means it wasn't found
        return res.status(404).json({ msg: "Document not found" });
      }
      return res.json(data1[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });



app.post("/python",(req,res)=>{
    console.log(req.body.code)
    fs.writeFileSync('test.py', req.body.code);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        args: [1,2,3]
      };
      
      pythonshell.run('test.py', options).then(messages=>{
        // if result is true then update participant-> solved in contest obj in db
        //before sending check for winning condition
        res.json({msg:messages})//also send the updated contest obj
      });    
})



app.listen(3000)