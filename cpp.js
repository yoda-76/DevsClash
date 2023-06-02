const express = require("express")
const app = express()
app.use(express.static('.codehelp-compiler'));
app.use(express.urlencoded({ extended: true }));
const { generateFile } = require("./generateFile");
const {c, cpp, node, python, java} = require('codehelp-compiler');
app.use(express.json());
app.get("/", (req,res)=>{
   return  res.json({hee:"hee"});
})
app.post("/cpp", async(req,res)=>{

    //................................
    var user_name= req.body.user_name
    const roomId=req.body.roomId
    var data5=await contestObjModel.find({id:roomId})

    //................................
    const { language = "cpp", code = "heelo" , input} = req.body;
    if (code === undefined) {
      return res.status(400).json({ success: false, error: "Empty code body!" });
    }
    const filepath = await generateFile(language, code);
    //generating inputs to test
    const inputinp = data5[0].questions[Number(Q)].p[0];
    for(let k=0;k<inputinp.length;k++){
      var cppinput = "";
      var cppoutput = "";
      for(let i=0;i<inputinp[k].length-1;i++){
        if(typeof inputinp[k][i]=="number"){
          cppinput = cppinput.concat(inputinp[k][i] + "\r\n");
        }
        else if(typeof inputinp[k][i]== "string"){
          cppinput = cppinput.concat(inputinp[k][i]+ "\\r\\n");
        }
        else{
          for(let j=0;j<inputinp[k][i].length;j++){
            if(typeof inputinp[k][i][j]=="number"){
              cppinput = cppinput.concat(inputinp[k][i][j]+ "\\r\\n");
            }
            else if(typeof inputinp[k][i][j]== "string"){
              cppinput = cppinput.concat(inputinp[k][i][j]+"\\r\\n");
            }
          }
        }
      }
      //one input created
      if(typeof inputinp[k][inputinp[k].length -1]=="number"){
        cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1] + "\\r\\n");
      }
      else if(typeof inputinp[k][inputinp[k].length -1]== "string"){
        cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1]+ "\\r\\n");
      }
      else{
        for(let j=0;j<inputinp[k][inputinp[k].length -1].length;j++){
          if(typeof inputinp[k][inputinp[k].length -1][j]=="number"){
            cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1][j]+ "\\r\\n");
          }
          else if(typeof inputinp[k][i][j]== "string"){
            cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1][j]+ "\\r\\n");
          }
        }
      }
      //its output created
      console.log(cppinput+" "+cppoutput);
    }
    //cppinput= JSON.stringify(cppinput);
    console.log(cppinput);
    let resultPromise = cpp.runFile(`${filepath}`, { stdin: cppinput}, {compileTimeout:500000});
    resultPromise
    .then(message => {
        console.log(message);
        if (messages==cppoutput){
        
          const t =async (user_name, Q)=>{
                  data5=await contestObjModel.find({id:roomId})
                  console.log("user:",user_name)
                  console.log("contest:",data5)
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
                } 
                // t(user_name, Q)
                t(user_name, Q)
     
        } //result object
    })
    .catch(err => {
        console.log(err);
    });
    res.json({
      incpp: inputinp,
      inpcpp: cppinput
    })
})
app.listen(3000, () => {
    console.log(`Listening on port 3000!`); 
});
//json for testing
//{
//  "input": "[ [ 5,[1,2,2,2,5],[1,5] ],[ 5,[3,2,3,4,5],[1,2,3,4,5]] ,[3,[1,1,1],[0]] ]"
//}  


// to do list 
//1. devsclash 
//2. portfolio 
//3. the is success