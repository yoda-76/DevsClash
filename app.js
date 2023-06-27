
const fs=require('fs')
const cors=require("cors")
const express =require("express")
const app=express()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const pythonshell=require("python-shell").PythonShell
// const compiler = require('compilex');
// const options = {stats : true}; //prints stats on console 
// compiler.init(options);
app.use(bodyParser.json())
app.use(cors())

app.use(express.static('.codehelp-compiler'));
app.use(express.urlencoded({ extended: true }));
const { generateFile } = require("./generateFile");
const {c, cpp, node, python, java} = require('codehelp-compiler');
app.use(express.json());
//....................................................................
app.post("/cpp", async(req,res)=>{

  //................................
  var user_name= req.body.user_name
  const Q=req.body.Q
  const roomId=req.body.roomId
  var data5=await contestObjModel.find({id:roomId})

  //................................
  
  //generating inputs to test
  const inputinp = JSON.parse(data5[0].questions[Number(Q)].testcase);
  console.log(inputinp)
  for(let k=0;k<inputinp.length;k++){
    var cppinput = "";
    var cppoutput = "";
    var output="";
    for(let i=0;i<inputinp[k].length-1;i++){
      if(typeof inputinp[k][i]=="number"){
        cppinput = cppinput.concat(inputinp[k][i] + "\r\n");
      }
      else if(typeof inputinp[k][i]== "string"){
        cppinput = cppinput.concat(inputinp[k][i]+ "\r\n");
      }
      else{
        for(let j=0;j<inputinp[k][i].length;j++){
          if(typeof inputinp[k][i][j]=="number"){
            cppinput = cppinput.concat(inputinp[k][i][j]+ "\r\n");
          }
          else if(typeof inputinp[k][i][j]== "string"){
            cppinput = cppinput.concat(inputinp[k][i][j]+"\r\n");
          }
        }
      }
    }
    
    //program executed
    //formation of output
    if(typeof inputinp[k][inputinp[k].length -1]==="number"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1] + "\r\n");
    }
    else if(typeof inputinp[k][inputinp[k].length -1]==="string"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1]+ "\r\n");
    }
    else{
      for(let j=0;j<inputinp[k][inputinp[k].length -1].length;j++){
        if(typeof inputinp[k][inputinp[k].length -1][j]==="number"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1][j]+ "\r\n");
        }
        else if(typeof inputinp[k][inputinp[k].length-1][j]==="string"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1][j]+ "\r\n");
        }
      }
    }
    console.log(cppinput+cppoutput)
    
  }

  const { language = "cpp", code = "heelo" ,} = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  const filepath = await generateFile(language, code);

  let resultPromise = cpp.runFile(`${filepath}`, { stdin: cppinput}, {compileTimeout:500000});
  resultPromise.then(result => {
    console.log(result.stdout);

    if(result.stdout==cppoutput){
      t(user_name, Q)
    }
    })
    .catch(err => {
        console.log(err);
    });
    

  res.json({
    incpp: cppinput,
    inpcpp: cppoutput
  })
})
//....................................................................

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
const questionSchema=mongoose.Schema({
  qId:String,
  statement:String,
  testcase: Object,
  topic:String,
  difficulty:String,
  explanation: String
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
const questionObjectModel=new mongoose.model('questionObjectModel',questionSchema);



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

  //sortin on basis of number of time increasing order
  p.sort((a,b) => {return b.solved - a.solved});
  //sorting on the basis or number of questions in decreasing order
  p.sort((a,b) => {return b.noOfQuestionsSolved - a.noOfQuestionsSolved});
  res.json(p)

  //...................
})


// app.post("/leaderboard",async(req,res)=>{
//     const data=await contestObjModel.find({id:req.body.roomId})
//     var p=[]
//     data[0].participants.map((i)=>{
//       p.push({user_name:i.user_name,noOfQuestionsSolved:i.noOfQuestionsSolved, solved: Math.max(...i.solved)})
//     })

    
//     //sortin on basis of number of questions

    
//     //..................
//     function bubbleSort(arr){
//       for(let i = 0; i < arr.length; i++){     
//           for(let j = 0; j < arr.length - i - 1; j++){
//               if(arr[j + 1].noOfQuestionsSolved > arr[j].noOfQuestionsSolved){
//                   [arr[j + 1],arr[j]] = [arr[j],arr[j + 1]]
//               }
//           }
//       };
//       return arr;
//   };
//   console.log(p)
//   bubbleSort(p)
//   console.log(p)

//   res.json(p)

//     //...................
// })

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
    const userCheck1=await userObjectModel.find({user_name:req.body.user_name})
    const userCheck2=await userObjectModel.find({email:req.body.email})
    
    if(!userCheck1[0] && !userCheck2[0]){
      const newobj = new userObjectModel({contest: [], wallet:0,name:data.name, user_name:data.user_name, password:data.password, email:data.email});
      await newobj.save();
      res.send("done");
    }
    else{
      res.send("use unique username and email")
    }

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
  var Q= await questionObjectModel.find({})
  // console.log(Q)
  console.log(`Topic=${req.body.topic}`)
  console.log(`diff=${req.body.difficulty}`)

   

  Q=Q.filter(q=>{return q.topic.includes(req.body.topic) &&  q.difficulty.includes(req.body.difficulty)})
  console.log(Q)
    const questions=[]
    for(let i=0;i<Number(req.body.noOfQuestions);i++){
      if(Q.length==1){
        temp=0
      }
      else{
        temp=Math.floor((Math.random() * Q.length) + 1)
      }
        
        questions[i]=Q[temp]
        console.log(`temp=${temp}`)
        console.log("insidi",i,questions[i])    
    }
    console.log("choosen qs",questions)
    // console.log(Q[Math.floor((Math.random() * 10) + 1)])

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

      // if user doesnt exixt
      const loggedInUser=data1[0].participants.filter((p)=>p.user_name==user_name)
      if(!loggedInUser[0]){
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
      } 
      else{
        res.json(data1[0]);
      }
    }catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
      

  });



app.patch("/runcode",async(req,res)=>{
    var user_name= req.body.user_name
    const roomId=req.body.roomId
    const Q=req.body.Q
    const code=req.body.code
    const lang =req.body.lang
    var data5=await contestObjModel.find({id:roomId})

    // console.log(`
    // id=${user_name}
    // room id = ${roomId}
    // Q= ${Q}
    
    // `)

  const t =async (user_name, Q)=>{
    data5=await contestObjModel.find({id:roomId})
    console.log("user:",user_name)
    console.log("participants:",data5[0].participants)
    var updatedPartcipants=data5[0].participants
    updatedPartcipants.map((p)=>{
      if(p.user_name==user_name){
        const d = new Date()
        const time=d.getTime()
        if(!p.solved[Q]){
          p.solved[Q]=time
          p.noOfQuestionsSolved++   
        }             
      }
    })
    const result = await contestObjModel.updateOne(
      { id:roomId },
      { $set: { participants: updatedPartcipants }}
    );
    if (result.nModified === 0) {
      // If the document wasn't modified, it means it wasn't found
      return res.status(404).json({ msg: "Document not found" });
    }
  } 

  //....................................
  //parsing the testcases


  const inputinp = JSON.parse(data5[0].questions[Number(Q)].testcase);
  // console.log(inputinp)
  for(let k=0;k<inputinp.length;k++){
    var cppinput = "";
    var cppoutput = "";
    var output="";
    for(let i=0;i<inputinp[k].length-1;i++){
      if(typeof inputinp[k][i]=="number"){
        cppinput = cppinput.concat(inputinp[k][i] + "\r\n");
      }
      else if(typeof inputinp[k][i]== "string"){
        cppinput = cppinput.concat(inputinp[k][i]+ "\r\n");
      }
      else{
        for(let j=0;j<inputinp[k][i].length;j++){
          if(typeof inputinp[k][i][j]=="number"){
            cppinput = cppinput.concat(inputinp[k][i][j]+ "\r\n");
          }
          else if(typeof inputinp[k][i][j]== "string"){
            cppinput = cppinput.concat(inputinp[k][i][j]+"\r\n");
          }
        }
      }
    }
    
    //program executed
    //formation of output
    if(typeof inputinp[k][inputinp[k].length -1]==="number"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1] + "\r\n");
    }
    else if(typeof inputinp[k][inputinp[k].length -1]==="string"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1]+ "\r\n");
    }
    else{
      for(let j=0;j<inputinp[k][inputinp[k].length -1].length;j++){
        if(typeof inputinp[k][inputinp[k].length -1][j]==="number"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1][j]+ "\r\n");
        }
        else if(typeof inputinp[k][inputinp[k].length-1][j]==="string"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length-1][j]+ "\r\n");
        }
      }
    }
  }

// .....................................................................................


if(lang=="python"){
  fs.writeFileSync(`id${user_name}.py`, code);
    // console.log(data5[0].questions[Number(Q)])
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        args: cppinput
      };
      pythonshell.run(`id${user_name}.py`, options).then(messages=>{
        if (messages==cppoutput){
          t(user_name, Q)
          res.json({msg:True})
        }else{
          res.json({msg:False})
        }
      }); 
}
else if(lang=="cpp"){
    if (code === undefined) {
      return res.status(400).json({ success: false, error: "Empty code body!" });
    }
    const filepath = await generateFile("cpp", code);
    let resultPromise = cpp.runFile(`${filepath}`, { stdin: cppinput}, {compileTimeout:500000});
    resultPromise.then(result => {
      console.log(result.stdout);
      if(result.stdout==cppoutput){
        t(user_name, Q)
        res.json({msg:True})
      }else{
        res.json({msg:False})
      }
      })
      .catch(err => {
          console.log(err);
      });
      res.json({msg:"cpp"})//also send the updated contest obj
}
})


app.post("/uploadQuestion",(req,res)=>{
  const questionObj={qId:req.body.qId,statement:req.body.statement, testcase:req.body.testcase, topic:req.body.topic, difficulty:req.body.difficulty, explanation:req.body.explanation}

  const newQuestion=new questionObjectModel(questionObj)
  newQuestion.save()

  res.send("question saved")
})
app.get("/getQuestions",async(req,res)=>{
  const data=await questionObjectModel.find({})
  console.log(data)
  res.send(data)
})











app.patch("/python2",async(req,res)=>{
  console.log(req.body.code)
  const qId=req.body.qId
  var user_name= req.body.user_name
  const roomId=req.body.roomId
  const Q=req.body.Q

  var data5=await questionObjectModel.find({qId})

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
      args: data5[0].testcase[0]
    };
    
    pythonshell.run(`id${user_name}.py`, options).then(messages=>{
       // if result is true then update participant-> solved in contest obj in db
  if (messages=="True"){
      
    const t =async (user_name, Q)=>{
            data5=await contestObjModel.find({id:roomId})
            console.log("user:",user_name)
            console.log("contest:",data5)
            console.log("participants:",data5[0].participants)


            var updatedPartcipants=data5[0].participants
            updatedPartcipants.map((p)=>{
              if(p.user_name==user_name){
                // console.log("user found", p)
                const d = new Date()
                const time=d.getTime()
                // console.log("Q",Q)
                // console.log(p.solved)
                if(!p.solved[Q]){
                  p.solved[Q]=time
                  p.noOfQuestionsSolved++   
                }             
              }
            })
            


            // data5.map((p)=>{
            //   const solved=p.solved
            //   if(p.user_name==user_name){

            //     var currdate=new Date()
            //     currdate=curdate.getTime()

            //     solved[Q] = currdate
            //     console.log("solved:",solved)
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








app.listen(3000)



