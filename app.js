const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const services = require('./service/service')

// 서버 확인
app.get('/', (req, res) => {
    return res.status(200).json({ "message": "welcome to my 1st project!" })
})

// API로 users 정보 확인
app.get('/users', services.showUsers)

// 회원 가입
app.post('/users/signUp', services.signUp)

// 로그인
app.post('/users/login', services.login)

// 수정
app.put('/users/:id', services.updateUserInfo)

// 삭제
app.delete('/users/:id', services.deleteUserInfo)

// threads 게시물 작성
app.post('/thread/write', services.uploadThread)

// threads 게시물 확인
app.get('/threads', services.showThread)

const server = http.createServer(app)

const start = () => {
    try {
        const PORT = 8000
        server.listen(PORT, () => console.log(`Server is listening on ${PORT}`))
    } catch (err) {
        console.error(err)
    }
}

start()

// const masterOfThreads = await myDataSource.query(`
//         SELECT id FROM users WHERE id = '${users.id}';
//         `)
// // 게시물 주인 확인
// if (user_id !== masterOfThreads) {
//     const error = new Error("")