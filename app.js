const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userServices = require('./Services/userServices.js') //추가 
const threadServices = require('./Services/postServices.js') //추가 

const app = express();

app.use(cors());
app.use(express.json());

app.post("/users/signup", userServices.signUp);
app.post("/users/login", userServices.logIn);
app.get("/", userServices.getUsers);
app.get("/posts/read", userServices.readThreads); //게시글 조회 
app.post("/posts/create", userServices.createThreads);

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Soheon's server!" });
  } catch (err) {
    console.log(err);
  }
});

const server = http.createServer(app);

const start = async () => {
  try {
    server.listen(portNumber, () => console.log(`Server is listening on 8000`));  // 이부분 + .env + .env.sample -> port 변수화 모르겠.. 
  } catch (err) {
    console.error(err);
  }
};


start();
