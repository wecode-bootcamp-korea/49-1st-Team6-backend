const { DataSource } = require("typeorm");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");  

require("dotenv").config();

const myDataSource = new AppDataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized_userServices!");
});

const readThreads = async (req, res) => {
  try {
    const me = req.body;
    console.log(me);

    const { password, email, nickname } = me;

    if (
      email === undefined ||
      password === undefined ||
      nickname === undefined
    ) {
      const error = new Error("KEY_ERROR");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await myDataSource.query(`
      SELECT id, email FROM users WHERE email='${email}';   
      `);
    console.log("existing user:", existingUser);

    if (existingUser.length > 0) {
      const error = new Error("DUPLICATED_EMAIL_ADDRESS");
      error.statusCode = 400;
      throw error;
    }

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const extractedEmails = email.match(emailRegex);
    if (!email.match(emailRegex)) {
      const error = new Error("특수문자 사용 안함");
      error.statusCode = 400;
      throw error;
    }
    console.log(extractedEmails);

    if (password.length < 10) {
      const error = new Error("INVALID_PASSWORD");
      error.statusCode = 400;
      throw error;
    }

    const userData = await myDataSource.query(`
        INSERT INTO users (                    
        password,
        email, 
        nickname
        )
        VALUES (
        '${nickname}'
        '${password}', 
        '${email}'
        )
    `);

    console.log("after insert into", userData);

    return res.status(201).json({
      message: "userCreated",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }
};

const logIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === undefined || password === undefined) {
      const error = new Error("KEY_ERROR");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await myDataSource.query(`
    SELECT id, email, password FROM users WHERE email='${email}';
    `);
    console.log("existing user:", existingUser);

    if (existingUser.length === 0) {
      const error = new Error("EMAIL_Unexist");
      error.statusCode = 400;
      throw error;
    }

    console.log("existing user:", existingUser);
    console.log("email", "password");

    console.log(password);

    //if (password !== existingUser[0].password) {
    //  const error = new Error("INVALID_PASSWORD");
    //  error.statusCode = 400;
    //  throw error;
    // }

    // 해쉬화 (bcypt아직.. 코드만..)
    const hashPw = await bcrypt.compare(password, existingUser[0].password);

    if(!hashPw){
        const error = new Error("passwordError")
        error.statusCode = 400
        error.code = "passwordError"
        throw error
    }

    const token = jwt.sign({ id: existingUser[0].id }, process.env.TYPEORM_JWT);  //signature .... 
    return res.status(200).json({
      message: "LOGIN_SUCCESS",
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    //return res.status(400).json(error) 이거 넣어야 하나요? 
  }
};


// 이 부분 필요 없나요?
const getUsers = async (req, res) => {
  try {
    const userData = await myDataSource.query(
      "SELECT id, nickname, email FROM USERS "
    );

    console.log("USER DATA:", userData);

    return res.status(200).json({
      users: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exprots = {
  signUp: signUp,
  logIn: logIn,
  getUsers: getUsers,
};
