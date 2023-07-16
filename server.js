const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dir_ = __dirname + "/upload/";

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const up = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir_);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      file.originalname.replace(/[''""©!()#@{}$%&*\sÀ-ú]/g, "_");
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: up });

app.post("/upload", upload.array("files"), (req, res, error) => {
  if (req.files.length == 0) {
    throw "No valid files sent";
  }
  res.json("Okay! " + req.files.length + " files sent");
});

app.get("/get/:name", (req, res) => {
  try {
    res
      .sendFile(dir_ + req.params.name)
  } catch (error) {
    res.json({ error });
  }
});

app.get("/list", (req, res, error) => {
  fs.readdir(dir_, async (error, files) => {
    if (error) console.log(error);
    var arr = [];
    await files.forEach((file) => {
      arr.push(file);
    });
    await res.json(arr);
  });
});

app.use((error, req, res, next) => {
  res.json({ error: error.message });
});

app.get("/", express.static("public"));

app.listen(400);
