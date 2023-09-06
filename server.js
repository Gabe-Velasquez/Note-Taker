//importing modules/files into project
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const db = require('./db/db.json');
const dbPath = path.join(__dirname,'./db/db.json');
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//static routes for application
app.use(express.static('public'));

// routes to index on startup 
app.get('/', (req,res)=>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname,'/public/notes.html'))
});

app.get('/api/notes', (req,res)=>{
    return res.json(db);
});

// app.get('/api/notes/:id', (req,res)=>{
//     res.json(json.parse(data)[req.params.id]);
// });

//fallback for everything else to go to index.
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'))
});

// Referred to lessons (lesson 19 in express section of the course) when writing this out
// post request for the notes page that sends a request and response 
app.post('/api/notes', (req,res) => {
    let newNotes = req.body;
    let lastID = 0;
    //for loop that loops through our database and creating an entry 
    for (let i = 0; i < db; i++) {
        let noteID = db[i];

        if (noteID.id > lastID) {
            lastID = noteID.id;
        }
    }
    // Once an entry is created, we add 1 from the last entry to make it unique. After, we push to the database with our new information
    newNotes.id = lastID + 1;
    db.push(newNotes);
    // Writes to db if the error is false. If it is true it will return the error 
    fs.writeFile(dbPath, JSON.stringify(db), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('We saved your note!');
        }
    });
    res.json(newNotes);   
});

// Delete request from user to get something off database. referring to mini project of that week to help build this. did not have helpers folder so had to figure out. built another for loop and removes array item. 
app.delete('/api/notes/:id', (req,res)=>{
   for (let i=0; i < db.length; i++){
    if (db[i].id == req.params.id){
        db.splice(i,1);
    }}
    // writes a file to database 
    fs.writeFile(dbPath,JSON.stringify(db), function (err){
        if (err){
            return console.log(err);
        }else{
            console.log('Deleted your note!');
        }
    });
    res.json(db);
   });

// Adding this for testing purposes
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);