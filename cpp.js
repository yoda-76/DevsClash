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


  const { language = "cpp", code = "heelo" , input} = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  const filepath = await generateFile(language, code);
  //generating inputs to test
  const inputinp = JSON.parse(input);
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
    let resultPromise = cpp.runFile(`${filepath}`, { stdin: cppinput}, {compileTimeout:500000});
    resultPromise
    .then(result => {
        //console.log(result);
        console.log(result.stdout);
    })
    .catch(err => {
        console.log(err);
    });
    if(typeof inputinp[k][inputinp[k].length -1]==="number"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1] + "\r\n");
    }
    else if(typeof inputinp[k][inputinp[k].length -1]==="string"){
      cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1]+ "\r\n");
    }
    else{
      for(let j=0;j<inputinp[k][inputinp[k].length -1].length;j++){
        if(typeof inputinp[k][inputinp[k].length -1][j]==="number"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1][j]+ "\r\n");
        }
        else if(typeof inputinp[k][i][j]==="string"){
          cppoutput = cppoutput.concat(inputinp[k][inputinp[k].length -1][j]+ "\r\n");
        }
      }
    }
  }
  res.json({
    incpp: cppinput,
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