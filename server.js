//importing modules/files into project
const express = require("express");
const fs = require("fs");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const app = express();
const db = require("./db/db.json");
const dbPath = path.join(__dirname, "./db/db.json");
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//static routes for application
app.use(express.static("public"));

// routes to index on startup
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
    //  Created a for loop that will look for a match in ids. once it finds it, it will remove it. Created this for the frontend portion
    const selectNote = req.params.id
    for (let i = 0; i < db.length; i++) {
        if (selectNote === db[i].id) {
            db.splice(i, 1)
        }
    }
  //backend portion reads file for our notes, sees if there is an error and if its true returns error. 
  fs.readFile("./db/db.json", (err, data) => {
    let entireNotes = JSON.parse(data);
    const updatedNotes = entireNotes.filter(({ id }) => id !== req.params.id);
    console.log(updatedNotes);
    //updates json file based on what was deleted and styled json a bit for easier reading. 
    fs.writeFile(dbPath, JSON.stringify(updatedNotes, null, 2), (err) => {
      if (err) {
        return res.json({ error: "Error writing to file" });
      }
    });
    res.json(db);
  });
});


app.post("/api/notes", (req, res) => {
    // imported uuid to give the new notes a unique id. and pushes our new note to the data base 
  const noteNew = { ...req.body, id: uuid4() };
  db.push(noteNew);
    //writes file to our database while catching any errors that occur. 
  fs.writeFile(dbPath, JSON.stringify(db, null, 2), (error) => {
    if (error) {
      return res.json({ error: "There was an error writing your note" });
    }
    return res.json(noteNew);
  });
});

//fallback for everything else to go to index.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Adding this for testing purposes
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
