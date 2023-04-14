
const fs=require('fs')
const cors=require("cors")
const express =require("express")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const pythonshell=require("python-shell").PythonShell
const compiler = require('compilex');
const options = {stats : true}; //prints stats on console 
compiler.init(options);

app.use(bodyParser.json())
app.use(cors())

var Q=[{st:`Given a positive integer n, find the nth fibonacci number. Since the answer can be very large, return the answer modulo 1000000007
Example 
Input: n = 2
Output: 1
    `,p:[[89,544858368]]},
    {st:`Write a program to Validate an IPv4 Address.
According to Wikipedia, IPv4 addresses are canonically represented in dot-decimal notation, which consists of four decimal numbers, each ranging from 0 to 255, separated by dots, e.g., 172.16.254.1
A valid IPv4 Address is of the form x1.x2.x3.x4 where 0 <= (x1, x2, x3, x4) <= 255.
Thus, we can write the generalized form of an IPv4 address as (0-255).(0-255).(0-255).(0-255).
Note: Here we are considering numbers only from 0 to 255 and any additional leading zeroes will be considered invalid.
Your task is to complete the function isValid which returns 1 if the given IPv4 address is valid else returns 0. The function takes the IPv4 address as the only argument in the form of string.
Example 
Input:
IPv4 address = 222.111.111.111
Output: 1
    `,p:[[5555.555,0]]},
    {st:`Given a non-negative integer N. The task is to check if N is a power of 2. More formally, check if N can be expressed as 2x for some x.
Example :
Input: N = 1
Output: YES
    `,p:[[98,"NO"]]},
    {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
    Example :  
    Input: N = 4
    Output: 5
      `,p:[[17,35]]},
      {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
      Example :  
      Input: N = 4
      Output: 5
        `,p:[[17,35]]},
        {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
        Example :  
        Input: N = 4
        Output: 5
          `,p:[[17,35]]},
          {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
          Example :  
          Input: N = 4
          Output: 5
            `,p:[[17,35]]},
            {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
            Example :  
            Input: N = 4
            Output: 5
              `,p:[[17,35]]},
              {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
              Example :  
              Input: N = 4
              Output: 5
                `,p:[[17,35]]},
                {st:`You are given a number N. Find the total count of set bits for all numbers from 1 to N(both inclusive).
                Example :  
                Input: N = 4
                Output: 5
                  `,p:[[17,35]]}
    


]
const contestSchema=mongoose.Schema({
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
    participants:Object,
    winner:String

})

const userSchema=mongoose.Schema({
  user_name: String,
  password: String,
  email: String,
  name: String,
  contest: Object,
  wallet: Number,

})

const contestObjModel=new mongoose.model('contestObjModel',contestSchema);
const userObjectModel=new mongoose.model('userObjModel',userSchema);


mongoose.connect('mongodb+srv://yadvendras20:abcd1234@cluster0.qw0zi6d.mongodb.net/?retryWrites=true&w=majority').then(e=>{
    console.log("success")
}).catch(err=>{
    console.log(err)
})



app.get("/",async(req,res)=>{
    const data=await contestObjModel.find({})
    res.json({result:data})
})

app.post("/mycontest", async(req,res)=>{
  const user_name=req.body.user_name
  const data=await userObjectModel.find({user_name})
  const response={contest: data[0].contest, wallet:data[0].wallet,name:data[0].name, user_name:data[0].user_name, email:data[0].email}
  console.log(response)
  res.json(response)

})

app.post("/signin", async(req,res)=>{
    const data= req.body;
    const newobj = new userObjectModel({contest: [], wallet:0,name:data.name, user_name:data.user_name, password:data.password, email:data.email});
    await newobj.save();
    res.send("done");
});

app.post("/login",async(req,res)=>{
  const {user_name, password}=req.body;
  
  const data = await userObjectModel.find({user_name:user_name});
  // console.log("data",response);
  if(data[0]){
    const response={contest: data[0].contest, wallet:data[0].wallet,name:data[0].name, user_name:data[0].user_name, email:data[0].email}
      
    if(data[0].password === password){
        res.json({msg:"true",user:response});
    }else{
      res.json({msg:"wrong password"})
    }
  }
  else{
    res.send({msg:"user not found"});
  }
  
});

// const  checkWin =async(roomId,id)=>{
//     const data=await contestObjModel.find({id:roomId})
//     console.log(data[0].participants)
//     const p=data[0].participants.filter((p)=>{
//         return p.id==id})
//     const count=0
//     p.map((n)=>{
//         if(n==1){
//             count=count+1
//         }
//     })
//     console.log(p)
//         if(count==data[0].noOfQuestions){
            


//             // ...........
//             // app.patch("/winner", async (req, res) => {
//             //     try {
//             //       const roomId = req.body.roomId;
//             //       console.log("roomId",roomId)
//             //       const id=req.body.id
//             //       console.log("id",id)
            
                  
//             //       const result = await contestObjModel.updateOne(
//             //         { id:roomId },
//             //         { $set: { winner: id} }
//             //       );
//             //       if (result.nModified === 0) {
//             //         // If the document wasn't modified, it means it wasn't found
//             //         return res.status(404).json({ msg: "Document not found" });
//             //       }
//             //       const data4=await contestObjModel.find({id:roomId})
//             //       return res.json(data4[0]);
//             //     } catch (error) {
//             //       console.error(error);
//             //       return res.status(500).json({ msg: "Internal Server Error" });
//             //     }
//             //   });
//             // ............
        
        
//         }
// }







app.post('/create',async(req,res)=>{
    console.log(req.body)
    //generate questions dinamically
    const questions=[]
    for(let i=0;i<Number(req.body.noOfQuestions);i++){
        questions[i]=Q[Math.floor((Math.random() * 10) + 1)]
        
        console.log("insidi",i,questions[i])    
    }
    console.log("choosen qs",questions)
    console.log(Q[Math.floor((Math.random() * 10) + 1)])

    const cObj={...req.body,questions:questions, participants: [{user_name:req.body.user_name, solved: 0}]}
    const newObj=new contestObjModel(cObj);
    await newObj.save()
    res.json(cObj)
})


app.patch("/join", async (req, res) => {
    try {
      const roomId = req.body.roomId;
      console.log("roomId:",roomId)
      const user_name=req.body.user_name
      console.log("user_name:",user_name)

      var data1=await contestObjModel.find({id:roomId})
      console.log(data1)

      const result = await contestObjModel.updateOne(
        { id:roomId },
        { $set: { participants: [...(data1[0].participants),{user_name:user_name, solved:Array(2).fill(0)}]} }
      );
      if (result.nModified === 0) {
        // If the document wasn't modified, it means it wasn't found
        return res.status(404).json({ msg: "Document not found" });
      }
      const user=await userObjectModel.find({user_name:user_name})
      const result2 = await userObjectModel.updateOne(
        { user_name:user_name },
        { $set: { contest: [...(user[0].contest),roomId]} }
      );
      if (result2.nModified === 0) {
        // If the document wasn't modified, it means it wasn't found
        return res.status(404).json({ msg: "user not found" });
      }
      data1=await contestObjModel.find({id:roomId})
      return res.json(data1[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });



app.post("/python",async(req,res)=>{
    console.log(req.body.code)
    const user_name= req.body.user_name
    const roomId=req.body.roomId
    const Q=req.body.Q

    var data5=await contestObjModel.find({id:roomId})
      console.log(data5)

    // var data5=await contestObjModel.find({id:roomId}).then(()=>{
    //   console.log(data5)
    // })
    // data5=data5.filter((obj)=>obj.id===roomId)
    // console.log(`
    // id=${id}
    // room id = ${roomId}
    // Q= ${Q}
    // data = ${data5}
    // `)
    fs.writeFileSync(`id${user_name}.py`, req.body.code);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        args: data5[0].questions[Number(Q)].p[0]
      };
      
      pythonshell.run(`id${user_name}.py`, options).then(messages=>{
         // if result is true then update participant-> solved in contest obj in db
    if (messages=="true"){
        console.log("inside")
        
        const t=async()=>{
            var data2=await contestObjModel.find({id:roomId})
            console.log(data2)
            const updatedPartcipants=data2[0].participants.map((p)=>{
                if(p.user_name==user_name){
                    let solved=p.solved
                    console.log(Q)
                    solved[Number(Q)-1]=1
                    return {...p, solved:solved}
                }
                return p
            })
            console.log(updatedPartcipants[0].solved.length)
            const result = await contestObjModel.updateOne(
                { id:roomId },
                { $set: { participants: updatedPartcipants }}
              );
        }
        t()
        // checkWin(roomId,id)
    }
    //     //before sending check for winning condition
        res.json({msg:messages})//also send the updated contest obj
      });    
})

// app.post("/compiler",function(req,res){
//   const data = req.body;
//   const code = data.code;
//   const input= data.input;
//   const envData = { OS : "windows" , cmd : "g++"};
//   compiler.compileCPP(envData , code , function (data) {
//     res.send(data);
//     //data.error = error message 
//     //data.output = output value
// });
// });
app.listen(3000)



