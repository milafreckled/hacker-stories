
var express=require('express');
var bodyParser = require('body-parser');
var app=express();
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());
const driver = require("./src/database"); 
app.use(express.static(__dirname + "/public"));
app.get('/',function (req, res){
  // You should use one of line depending on type of frontend you are with
  res.sendFile(__dirname + '/index.html');
  console.log("Loaded!") //if html file is root directory
 //res.sendFile("index.html");
});


app.post('/add/:request',function (req,res){
    driver.storeRequest(req.params.request);
    console.log(req.body)
    res.send("Successfully added!")
});

app.listen(3000)