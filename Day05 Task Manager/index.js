const express = require("express");
const app = express();
const path = require('path');

const fs = require('node:fs')

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname + 'public')));


app.get("/", function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", {
            files: files
        });
    })
})


app.get("/files/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err)
            console.log(err);
        else {
            res.render("show", {
                filename: req.params.filename,
                filedata: filedata
            });
        }
    })
})

app.get("/edit/:filename", function (req, res) {
    res.render("edit", {
        filename: req.params.filename
    });
})

app.post("/create", function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, `${req.body.content}`, function (err) {
        if (err)
            console.log(err);
        else
            res.redirect("/")
    })
})

app.post("/edit", function (req, res) {
    fs.rename(`./files/${req.body.prev}`, `./files/${req.body.new}`, (err) => {
        res.redirect("/");
    })
})

app.listen(3000);