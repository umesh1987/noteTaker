// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile)


var notes = require("./db/db.json");

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.json(notes);
});

app.post("/api/notes", function(req, res) {

    var newID = 0;
    notes.forEach(item => {
        if (item.id > newID)
            newID = item.id;
    })
    newID++;

    req.body.id = newID;
    notes.push(req.body)
    writeFileAsync("./db/db.json", JSON.stringify(notes))
    console.log("Added new notes!")
    res.json(notes);
});

app.delete('/api/notes/:id', function(req, res) {

    console.log(notes.length);

    var loc = 0;

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == req.params.id) {
            console.log(notes[i]);
            loc = i;
            console.log(loc);
        }
    }
    notes.splice(loc, 1)

    writeFileAsync("./db/db.json", JSON.stringify(notes))
    res.json(notes);

});


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

//Lets check you are connect with local server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});