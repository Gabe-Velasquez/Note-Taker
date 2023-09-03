//importing modules/files into project
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const db = require('./db/db.json');
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
    res.json(db)
});

//fallback for everything else to go to index.
// app.get('*', (req,res)=>{
//     res.sendFile(path.join(__dirname,'/public/index.html'))
// });
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column

// Referred to lessons (lesson 19 in express section of the course) when writing this out
// post request for the notes page that sends a request and response 
app.post('/api/notes', (req,res) => {
    const { text, title } = req.body;
    //evaluates title and body if it already exists in database. in this case it will create a new note if it does not match.
    if (text && title){
        const newNote = {
            text,
            title
        };

        //reads files and converts data to string so we can save it
        fs.readFile('./db/db.json', 'utf8', (err,data)=>{
            if (err){
                console.log(err);
            }else{
                //converts string into json object 
                const parsedNotes=JSON.parse(data);
                //Adds new review
                parsedNotes.push(newNote);
                 //Writes string to file if error is true, returns error. false tells user the note is made
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes,null,4), (err)=>{
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                      } else {
                        const response = {
                          status: "success",
                          body: newNote,
                        };
                        console.log(response);
                        res.status(201).json(response);
                        }
                });
            }
        });
}});



// Adding this for testing purposes
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);