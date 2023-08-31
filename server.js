//importing modules into project
const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const app = express();
// const api = require('/public/index.html');
const PORT = 3008;



app.use(express.static('public'));
//Adding ACs for the project
// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
app.get('/', (req,res)=>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req,res)=>
    res.sendFile(path.join(__dirname,'public/notes.html'))
);

app.get('*', (req,res)=>
    res.sendFile(path.join(__dirname,'./public.index.html'))
)
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column

// Referred to lessons when writing this out 
app.post('./api/notes.html', (req,res) =>{
    const { text, title } = req.body;
    if (text && title){
        const newNote = {
            text,
            title
        };

        //reads files and converts data to string so we can save it
        const noteString = JSON.stringify(newNote);
        fs.readFile('./db/db.json', 'utf8', (err,data)=>{
            if (err){
                console.log(err);
            }else{
                const parsedNotes=JSON.parse(data)
                parsedNotes.push(newNote);
            }
        })

        //Writes string to file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes,null,4), (err)=>
            err
                ? console.log(err):console.log(`New note for ${newNote.title} has been written to JSON.`)
        )
        const response = {
            status: 'success',
            body: newNote
        };
        console.log(response);
        res.status(201).json(response);
    }else{
        res.status(500).json('Uh oh... there was an error');
    }
});
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page

// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes

// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column

// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

// Adding this for testing purposes
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);