// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "./models/user.js";



dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByNameAndJob(name, job) {
  return userModel.find({ name: name, job: job });
}

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined){
    findUserByNameAndJob(name, job)
      .then(result => {
        res.send({ users_list: result });
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  } else if (name != undefined) {
    findUserByName(name)
      .then(result => {
        res.send({ users_list: result });
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  } else {
    getUsers(name, job)
    .then(result => {
      res.send({ users_list: result });
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
  }
});

function findUserById(id) {
  return userModel.findById(id);
}

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  findUserById(id)
    .then(result => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});
  
function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd)
    .then(added => {
      res.status(201).send(added);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userModel.findByIdAndDelete(id)
    .then(result => {
      if (result === null) {
        res.status(404).send("Resource not found");
      } else {
        res.status(204).send(); // No content to send back
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

app.listen(port, () => {  
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
