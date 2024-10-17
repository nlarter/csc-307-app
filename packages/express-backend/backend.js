// backend.js
import express from "express";
import cors from "cors";


const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    },
    {
      "id": "qwe123",
      "job": "Zookeeper",
      "name": "Cindy"
    }
  ]
};

app.use(cors());
app.use(express.json());

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};


const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined){
    const result = findUserByNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});
  
const addUser = (user) => {
  generateId(user);
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const added = addUser(userToAdd);
  res.status(201).send(added);
});

const generateId = (user) => {
  const id = Math.floor(Math.random() * 1000000);
  user["id"] = id;
};

const deleteUser = (user) => {
  users["users_list"] = users["users_list"].filter(cuser => cuser["id"] !== user["id"]);
};

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    deleteUser(result);
    res.status(204).send(result);
  }
});

app.listen(port, () => {  
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
