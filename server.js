//importing modules/files into project
const express = require('express');
const fs = require('fs');
const { v4: uuid4 } = require('uuid'); 
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

app.post('/api/notes', (req,res) => {
    const noteNew = {...req.body, id: uuid4()};
    db.push(noteNew);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2),
    (error)=>{
        if (error){
            return res.json({error: 'There was an error writing your note'});
        }
        return res.json(noteNew);
    });
});

// Delete request from user to get something off database. referring to mini project of that week to help build this. did not have helpers folder so had to figure out. built another for loop and removes array item. 
app.delete('/api/notes/:id', (req,res)=>{
    //reads file for our notes, sees if there is an error and if its true returns error. 
    fs.readFile(dbPath, (err,data)=>{
        if (err) throw err;
        let notes = JSON.parse(data);
        const updateNotes = notes.filter(({id})=> id !== req.params.id);
        fs.writeFile(dbPath, JSON.stringify(updateNotes,
            (err)=>{
              if (err){
                return res.json({error: 'Error writing your note'});
              }  
              return res.json(updateNotes);
            })
        )
    });
   });

// Adding this for testing purposes
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);