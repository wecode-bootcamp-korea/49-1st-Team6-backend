require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const myDataSource = new AppDataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();

app.use(cors());
app.use(express.json());

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
    server.listen(portNumber, () => console.log(`Server is listening on 8000`));
  } catch (err) {
    console.error(err);
  }
};

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

start();
