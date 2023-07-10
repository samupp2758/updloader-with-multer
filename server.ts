const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dir_ = __dirname + "/upload/";

const app = express();

import bodyParser from 'body-parser';

app.use(bodyParser.json())

const up = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    cb(null, dir_);
  },
  filename: function (req:any, file:any, cb:any) {
    const uniqueSuffix = Date.now()+"-"+file.originalname.replace(/[''""©!()#@{}$%&*\sÀ-ú]/g,"_");
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: up });




app.post("/upload", upload.array("files"), (req:any, res:any,error:any) => {
  if (req.files.length == 0) {
    throw "No valid files sent";
  }
  res.json("Okay! " + req.files.length + " files sent");
});












app.get("/get/:name", (req:any, res:any) => {
  try{
  res.sendFile(__dirname + "/upload/" + req.params.name, (err:any, next:any) => {
    if(err){}
  }).catch((er:any)=>{
    res.json({er});
  })
}catch(error){
  res.send({error});

  }
});









app.get('/list',(req:any,res:any,error:any)=>{
  fs.readdir(__dirname + "/upload", async (error:any, files:any) => {
    if (error) console.log(error);
    var arr: any[] = [];
    await files.forEach((file:any) => {
      arr.push(file)
    });
    await res.json(arr);
  });
  
})






app.use((error:any, req: any, res: any, next: any) => {
  res.json({error:error.message})
});



app.get("/", express.static("public"));



app.listen(400);
