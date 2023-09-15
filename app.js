const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userServices = require('./Services/userServices.js') 
const threadServices = require('./Services/postServices.js') 

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/users/signup", userServices.signUp);
app.post("/users/login", userServices.logIn);
app.get("/", userServices.getUsers);
app.get("/posts/read", userServices.readThreads); 
app.post("/posts/create", userServices.createThreads);

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
} 

start()
