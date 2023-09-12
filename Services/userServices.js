const signUp = async (req, res) => {
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
      const error = new Error("DUPLICATED_EMAIL_ADDRESS");
      error.statusCode = 400;
      throw error;
    }

    console.log("existing user:", existingUser);
    console.log("email", "password");

    console.log(password);

    if (password !== existingUser[0].password) {
      const error = new Error("INVALID_PASSWORD");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign({ id: existingUser[0].id }, "rekey");
    return res.status(200).json({
      message: "LOGIN_SUCCESS",
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
  }
};

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
