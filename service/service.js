

const { DataSource } = require('typeorm')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')

dotenv.config()

const myDataSource = new DataSource({
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST, // .env 파일에서 가져온 호스트 정보
    port: process.env.DB_PORT, // .env 파일에서 가져온 포트 정보
    username: process.env.DB_USERNAME, // .env 파일에서 가져온 사용자 정보
    password: process.env.DB_PASSWORD, // .env 파일에서 가져온 비밀번호 정보
    database: process.env.DB_DATABASE
})

// 유저정보
const showUsers = async (req, res) => {
    try {
        const userData = await myDataSource.query(`
      SELECT id, nickname, email FROM users;
    `)
        return res.status(200).json({
            "users": userData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message": error.message
        })
    }
}
// 회원가입
const signUp = async (req, res) => {
    try {
        const { email, nickname, password, profile_images, birth_day, phone_number } = req.body
        // 구조 분해 할당
        console.log(req.body)
        // 공란 확인 작업
        if (!nickname || !email || !password) {
            const error = new Error("KEY_ERROR")
            error.statusCode = 400
            throw error
        }

        if (!email.includes('@', '.')) {
            const error = new Error("올바른 이메일이 아님니다.")
            error.statusCode = 400
            throw error
        }

        // 비밀번호 길이 애러
        if (password.length <= 8 && password.length >= 13) {
            const error = new Error("INVALID_PASSWORD")
            error.statusCode = 400
            throw error
        }

        // 기존 이메일을 DB로 부터 불러오는 코드
        const existingUser = await myDataSource.query(`
        SELECT id, email FROM users WHERE email = '${email}';
        `)

        // 이메일 중복 여부
        if (existingUser.length > 0) {
            const error = new Error("DUPLICATE_EMAIL")
            error.statusCode = 400
            throw error
        }

        // 특수기호 함수선언
        function superStrongPassword(password) {
            const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/
            return regex.test(password)
        }


        // 특수기호 사용 여부
        if (superStrongPassword(password) == false) {
            const error = new Error("NOT_STRONG")
            error.statusCode = 400
            throw error
        }

        // 비밀번호 해쉬화
        const hashedPassword = await bcrypt.hash(password, 10)

        // 닉네임 중복 여부
        const existingNickName = await myDataSource.query(`
        SELECT id, nickname FROM users WHERE email = '${nickname}';
        `)
        if (existingNickName.length > 0) {
            const error = new Error("중복된 닉네임")
            error.statusCode = 400
            throw error
        }

        // user 생성
        const userData = await myDataSource.query(`
      INSERT INTO users (
        nickname,
        password,
        email
      )
      VALUES (
        '${nickname}',
        '${hashedPassword}',
        '${email}'
      )
    `)

        //     let optionField = []
        //     // 빈 배열에 넣을 정보들,  요청에 제공된 정보를 선택적으로 필드에 넣는다.
        //     if (nickname) optionFieldField.push(`nickname = '${nickname}'`)
        //     if (password) optionFieldField.push(`password = '${password}'`)
        //     if (profile_images) optionFieldField.push(`profile_images = '${profile_images}'`)
        //     if (birth_day) optionField.push(`birth_day = '${birth_day}'`)
        //     if (phone_number) optionField.push(`phone_number = '${phone_number}'`)

        //     await myDataSource.query(`UPDATE users
        //     SET ${optionFieldField.join(", ")}
        //     WHERE id = ${userId}
        //   `)

        return res.status(201).json({
            "message": "userCreated"
        })
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode).json({
            "message": error.message
        })
    }
}
// 로그인
const login = async (req, res) => {
    try {
        // 구조 분해 할당
        const { email, password } = req.body

        // 공런이 있는지 확인
        if (email == undefined || password == undefined) {
            const error = new Error("KEY_ERROR")
            error.statusCode = 400
            throw error
        }

        // 유저 이메일 확인
        const inComeEmailPassword = await myDataSource.query(`
        SELECT email,password FROM users WHERE email = '${email}';
        `)
        if (inComeEmailPassword.length === 0) {
            const error = new Error('이메일 혹은 비밀번호가 일치하지 않습니다.')
            error.statusCode = 400
            throw error
        }

        const loginToken = jwt.sign({ id: inComeEmailPassword[0].id }, "token")
        const passwordMatch = await bcrypt.compare(password, inComeEmailPassword[0].password)

        if (passwordMatch) {
            return res.status(200).json({
                accessToken: loginToken,
                'message': '로그인 성공'
            })

        } else {
            const error = new Error('이메일 혹은 비밀번호가 일치하지 않습니다.')
            error.statusCode = 400
            throw error
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ 'message': '서버오류 ' })
    }
}
// 회원정보수정
const updateUserInfo = async (req, res) => {

    try {
        // 유저 아이디를 불러온다
        const userId = req.params.id
        // 구조 분해 할당
        const { nickname, password, profile_images, birth_day } = req.body
        // 업데이트할 빈 배열 선언
        let updateField = []
        // 빈 배열에 넣을 정보들,  요청에 제공된 정보를 선택적으로 필드에 넣는다.
        if (nickname) updateField.push(`nickname = '${nickname}'`)
        if (password) updateField.push(`password = '${password}'`)
        if (profile_images) updateField.push(`profile_images = '${profile_images}'`)
        if (birth_day) updateField.push(`birth_day = '${birth_day}'`)

        if (updateField.length === 0) {
            const error = new Error('업데이트할 정보가 없습니다.')
            error.statusCode = 400
            throw error
        }

        await myDataSource.query(`UPDATE users
        SET ${updateField.join(", ")}
        WHERE id = ${userId}
      `)

        return res.status(200).json({ 'message': '업데이트를 완료했습니다.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json('서버 오류')
    }
}
// 유저정보삭제
const deleteUserInfo = async (req, res) => {
    try {
        const userId = req.params.id

        await myDataSource.query(`DELETE FROM users WHERE id = '${userId}'`)

        return res.status(200).json({ 'messeage': '사용자 삭제 완료' })
    } catch (error) {
        console.error(error)
        return res.status(500).json('서버 오류')
    }
}

//============================================================================================threads==================================================================
// 게시물작성
const uploadThread = async (req, res) => {
    try {
        const { user_id, content, title } = req.body
        console.log(req.body)
        // 게시글 공란
        if (!user_id || !content || !title) {
            const error = new Error("공란이 있습니다 공백 없이 해주세요")
            error.statusCode = 400
            throw error
        }

        // threads 생성
        const threads = await myDataSource.query(`
      INSERT INTO threads 
      (
        user_id,
        title,
        content
      
      )VALUES (
        '${user_id}',
        '${title}',
        '${content}'
      );
    `)
        return res.status(201).json({
            "message": "게시물 작성 성공"
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ 'message': '서버오류 ' })
    }
}
// 게시물확인
const showThread = async (req, res) => {
    try {
        const threads = await myDataSource.query(`
        SELECT threads.id, threads.title, threads.content,
         threads.updated_at, threads.created_at, users.nickname 
        FROM users
        LEFT JOIN threads ON users.id = threads.user_id
        `)
        return res.status(200).json({
            "threads": threads
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message": error.message
        })
    }
}
// 게시물수정
const updateThread = async (req, res) => {

}
myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })

module.exports = { showUsers, signUp, login, updateUserInfo, deleteUserInfo, uploadThread, showThread }
