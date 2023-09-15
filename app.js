const http = require("http");
const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { signUp, logIn, getUsers } = require("./Services/userServices");
const { readThreads, createThreads } = require("./Services/postService");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/users/signup", signUp);
app.post("/users/login", logIn);
app.get("/", getUsers);
app.get("/posts/read", readThreads);
app.post("/posts/create", createThreads);

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Team6's server!" });
  } catch (err) {
    console.log(err);
  }
});

const server = http.createServer(app);
require("dotenv").config();
const portNumber = process.env.PORT || 8000;

const start = async () => {
  try {
    await server.listen(portNumber);
    console.log(`Server is listening on ${portNumber}`);
  } catch (err) {
    console.error(err);
  }
};

start();
