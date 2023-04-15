
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

var Q=[{st:`write a program to add two integer.
Example 
Input: a = 1 , b = 2
Output: 3
    `,p:[[4, 2, 6],[4, 6, 8],[5, 9, 14]]},
    {st:`find the diffrence of two numbers
Example 
Input:
a = 4, b = 2.
Output: 2
    `,p:[[4 ,0 ,4],[3, 3,0],[5,3,2]]},
              {st:`write a program to perform devision and return rimender.
              Example :  
              Input: n=5, m=4
              Output: 1
                `,p:[[5,4,1],[12,3,0],[9,2,1]]},
                {st:`Write a program to multiply 2 integer.
                Example :  
                Input: N = 4 , m=5
                Output: 20
                  `,p:[[4,5,20],[3,2,6],[2,2,4]]}
    


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
    winner:String,
    entryfee:Number

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

app.patch("/addmoney",async(req,res)=>{
  const user_name=req.body.user_name
  const addedmoney=req.body.addedMoney
  const data=await userObjectModel.find({user_name})
  const result = await userObjectModel.updateOne(
    { user_name:user_name },
    { $set: { wallet: Number(data[0].wallet)+ Number(addedmoney) }}
  );
  if (result.nModified === 0) {
    // If the document wasn't modified, it means it wasn't found
    return res.status(404).json({ msg: "Document not found" });
  }else{
    res.send("updated")
  }
})

app.post("/leaderboard",async(req,res)=>{
    const data=await contestObjModel.find({id:req.body.roomId})
    var p=[]
    data[0].participants.map((i)=>{
      p.push({user_name:i.user_name,noOfQuestionsSolved:i.noOfQuestionsSolved, solved: Math.max(...i.solved)})
    })
    //sortin on basis of number of questions

    


    //..................
    function bubbleSort(arr){

      //Outer pass
      for(let i = 0; i < arr.length; i++){
  
          //Inner pass
          for(let j = 0; j < arr.length - i - 1; j++){
  
              //Value comparison using ascending order
  
              if(arr[j + 1].noOfQuestionsSolved < arr[j].noOfQuestionsSolved){
  
                  //Swapping
                  [arr[j + 1],arr[j]] = [arr[j],arr[j + 1]]
              }
          }
      };
      return arr;
  };
  console.log(p)
  bubbleSort(p)
  console.log(p)

    //...................
})

app.post("/mycontest", async(req,res)=>{
  const user_name=req.body.user_name
  const data=await userObjectModel.find({user_name})
  const data2=await contestObjModel.find({})
  const filteredContest=data2.filter((c)=>{
    return data[0].contest.map((i)=>{return c.id==i})
  })

  const response={contest:filteredContest, wallet:data[0].wallet,name:data[0].name, user_name:data[0].user_name, email:data[0].email}
  console.log(response)
  res.json(response)

})

app.post("/getuser",async(req,res)=>{
  res.json((await userObjectModel.find({user_name:req.body.user_name}))[0])
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
    const entryfee=40;
    console.log(req.body)
    //generate questions dinamically
    const questions=[]
    for(let i=0;i<Number(req.body.noOfQuestions);i++){
        questions[i]=Q[Math.floor((Math.random() * 4) + 1)]
        
        console.log("insidi",i,questions[i])    
    }
    console.log("choosen qs",questions)
    console.log(Q[Math.floor((Math.random() * 10) + 1)])

    const cObj={...req.body,questions:questions, participants: [{user_name:req.body.user_name,noOfQuestionsSolved:0, solved: Array(req.body.noOfQuestions).fill(0)}]}
    console.log("cobj",cObj)
    //money deducted
    const data= await userObjectModel.find({user_name:req.body.user_name})
    const result = await userObjectModel.updateOne(
      { user_name:req.body.user_name },
      { $set: { wallet: Number(data[0].wallet)- entryfee }}
    );
    if (result.nModified === 0) {
      // If the document wasn't modified, it means it wasn't found
      return res.status(404).json({ msg: "Document not found" });
    }


      //contest created
    const newObj=new contestObjModel(cObj);
    await newObj.save()

    res.json(cObj)
})


app.patch("/join", async (req, res) => {
  var entryfee=40;
    try {
      const roomId = req.body.roomId;
      console.log("roomId:",roomId)
      const user_name=req.body.user_name
      console.log("user_name:",user_name)

      var data1=await contestObjModel.find({id:roomId})
      console.log(data1)

      //money deducted
    const data= await userObjectModel.find({user_name})

    const result1 = await userObjectModel.updateOne(
      { user_name:user_name },
      { $set: { wallet: Number(data[0].wallet)- entryfee }}
    );
    if (result1.nModified === 0) {
      // If the document wasn't modified, it means it wasn't found
      return res.status(404).json({ msg: "Document not found" });
    }

      //contest data updated

      const result = await contestObjModel.updateOne(
        { id:roomId },
        { $set: { participants: [...(data1[0].participants),{user_name:user_name,noOfQuestionsSolved:0, solved:Array(data1[0].noOfQuestions).fill(0)}]} }
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



app.patch("/python",async(req,res)=>{
    console.log(req.body.code)
    var user_name= req.body.user_name
    const roomId=req.body.roomId
    const Q=req.body.Q

    var data5=await contestObjModel.find({id:roomId})
      console.log(data5)

    // var data5=await contestObjModel.find({id:roomId}).then(()=>{
    //   console.log(data5)
    // })
    // data5=data5.filter((obj)=>obj.id===roomId)
    console.log(`
    id=${user_name}
    room id = ${roomId}
    Q= ${Q}
    data = ${data5}
    `)
    fs.writeFileSync(`id${user_name}.py`, req.body.code);

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        args: data5[0].questions[Number(Q)].p[0]
      };
      
      pythonshell.run(`id${user_name}.py`, options).then(messages=>{
         // if result is true then update participant-> solved in contest obj in db
    if (messages=="True"){
        
      const t =async (user_name, Q)=>{
              data5=await contestObjModel.find({id:roomId})
              console.log("user:",user_name)
              console.log("contest:",data5)
              console.log("participants:",data5[0].participants)


              var updatedPartcipants=[]
              data5[0].participants.map((p)=>{
                if(p.user_name==user_name){
                  // console.log("user found", p)
                  const d = new Date()
                  const time=d.getTime()
                  console.log("Q",Q)
                  console.log(p.solved)
                  p.solved[Q]=time
                  p.noOfQuestionsSolved++                }
                updatedPartcipants.push({user_name, solved:p.solved})
              })
              


              // data5.map((p)=>{
              //   const solved=p.solved
              //   if(p.user_name==user_name){

              //     var currdate=new Date()
              //     currdate=curdate.getTime()

              //     solved[Q] = currdate
              //     console.log("so;ved:",solved)
              //   }
              //   updatedPartcipants.push({solved, user_name:p.user_name})
              // })
              // console.log("up",updatedPartcipants)


              const result = await contestObjModel.updateOne(
                { id:roomId },
                { $set: { participants: updatedPartcipants }}
              );
            } 
            // t(user_name, Q)
            t(user_name, Q)
 
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



