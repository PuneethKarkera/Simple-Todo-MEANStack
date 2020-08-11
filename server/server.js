const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("./database/mongoose");
var passport = require("passport");
var jwt = require("express-jwt");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var auth = jwt({
  secret: "MY_SECRET",
  userProperty: "payload",
  algorithms: ["HS256"],
});

require("./config/passport");

const List = require("./database/models/list");
const Task = require("./database/models/task");

var ctrlProfile = require("./controllers/profile");
var ctrlAuth = require("./controllers/authentication");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

//USER AUTHENTICATION
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: err.name + ": " + err.message });
  }
});

app.post("/register", ctrlAuth.register);
app.post("/login", ctrlAuth.login);
app.get("/profile", auth, ctrlProfile.profileRead);

//LISTS
app.get("/lists", (req, res) => {
  List.find({})
    .then((lists) => res.send(lists))
    .catch((error) => console.log(error));
});

app.post("/lists", (req, res) => {
  new List({ title: req.body.title })
    .save()
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

app.get("/lists/:listId", (req, res) => {
  List.find({ _id: req.params.listId })
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

app.patch("/lists/:listId", (req, res) => {
  List.findOneAndUpdate({ _id: req.params.listId }, { $set: req.body })
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

app.delete("/lists/:listId", (req, res) => {
  const deleteTasks = (list) => {
    Task.deleteMany({ _listId: list._id })
      .then(() => list)
      .catch((error) => console.log(error));
  };

  List.findByIdAndDelete(req.params.listId)
    .then((list) => res.send(deleteTasks(list)))
    .catch((error) => console.log(error));
});

//TASKS

app.get("/lists/:listId/tasks", (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((tasks) => res.send(tasks))
    .catch((error) => console.log(error));
});

app.post("/lists/:listId/tasks", (req, res) => {
  new Task({ title: req.body.title, _listId: req.params.listId })
    .save()
    .then((task) => res.send(task))
    .catch((error) => console.log(error));
});

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOne({ _listId: req.params.listId, _id: req.params.taskId })
    .then((task) => res.send(task))
    .catch((error) => console.log(error));
});

app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    { _listId: req.params.listId, _id: req.params.taskId },
    { $set: req.body }
  )
    .then((task) => res.send(task))
    .catch((error) => console.log(error));
});

app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndDelete({ _listId: req.params.listId, _id: req.params.taskId })
    .then((task) => res.send(task))
    .catch((error) => console.log(error));
});

app.listen(3000, () => console.log("Server listening on port 3000"));
