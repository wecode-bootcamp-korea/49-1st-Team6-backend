//회원가입
const signUp = async (req, res) => {
    try {
      const me = req.body;
      console.log(me);
  
      // 2. DATABASE 정보 저장.
      const { password, email, nickname } = me;
  
      // email, password가 다 입력되지 않은 경우
      if (email === undefined || password === undefined || nickname === undefined) {
        const error = new Error("KEY_ERROR");
        error.statusCode = 400;
        throw error;
      }

      // 이메일 중복 
      const existingUser = await myDataSource.query(`
      SELECT id, email FROM users WHERE email='${email}';   
      `);
      console.log("existing user:", existingUser);

      if (existingUser.length > 0) {
        const error = new Error("DUPLICATED_EMAIL_ADDRESS");
        error.statusCode = 400;
        throw error;
      }
// email 특수문자 (./@ 포함)
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const extractedEmails = email.match(emailRegex);
      if(!email.match(emailRegex)) {
        const error = new Error("특수문자 사용 안함")
        error.statusCode = 400
        throw error
      }
        console.log(extractedEmails);
  

//패스워드 10자리 이상
            if (password.length < 10) {
        const error = new Error("INVALID_PASSWORD");
        error.statusCode = 400;
        throw error;
      }

   // 비밀번호 해쉬화
  // const hashedPassword = await bcrypt.hash(password, 10)
      


//DB에 저장 
    const userData = await myDataSource.query(`
        INSERT INTO users (
        name,                    
        password,
        email, nickname
        )
        VALUES (
        'yj',
        '${password}', 
        '${email}'
        )
    `);