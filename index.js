const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const EventEmitter = require('events');
const express = require('express');
const app = express();
const myEmitter = new EventEmitter;
const PORT = 3000;

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// call the route api
app.use('/api',require('./routes'));

app.get('/', function(req, res) {
    res.send('<input type="text" name="username" /> <input type="password" name="password" />');
})
app.listen(PORT, function(){
    console.log("Server running on localhost:" + PORT);
})

let newPathDirectory = path.join(__dirname,'Training Details');
fs.access(newPathDirectory,(err) =>{
    if(err) {
        fs.mkdir(newPathDirectory,function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("folder created successfully");
            }
        })
    }
    else {
        console.log("given directory already exists");
    }
})


let filePath = path.join(newPathDirectory,'student-data.txt');
fs.exists(filePath,(err) =>{
    if(err) {
        console.log("file already exists");
    }
    else {
        fs.writeFile(filePath,'Amitabha,Puja','utf-8',(err) => {
            if(err) {
                console.log(err);
            }
        })
    }
})

myEmitter.on('open', string => {
    console.log(`Opened! ${string}`);
});
  
myEmitter.on('close', string => {
    console.log(`Closed! ${string}`);
});

myEmitter.emit('open','onOpen');
myEmitter.emit('close','onClose');
