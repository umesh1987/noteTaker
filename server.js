// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(__dirname + "/public"));

const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile)


// verify port is connect
app.listen(PORT, function() {
    console.log("Your port is connect to " + PORT);
});

var notes = require("./db/db.json");

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays API
app.get("/api/notes", function(req, res) {
    res.json(notes);
});

//Sends you to index.html route
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

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
});

// delete function
function arryDelete(arr, value) {

    return arr.filter(function(ele) {
        return ele.id != value;
    });

}

app.delete("/api/notes", function(req, res) {
    let temp = req.body;

    notes = arryDelete(notes, temp);

    writeFileAsync("./db/db.json", JSON.stringify(notes));
    console.log("Deleted a note...");
})