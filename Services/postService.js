const { DataSource } = require("typeorm");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const myDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!_threadService");
});

// 게시물 목록 조회
const readThreads = async (req, res) => {
  try {
    const getThread = await myDataSource.query(`
        SELECT
        users.nickname,
        users.id,
        threads.id AS postId,
        threads.content,
        threads.created_at AS createdAt
        FROM threads
        INNER JOIN users ON threads.user_id = users.id
        ORDER BY threads.created_at DESC;
        `);

    console.log("success");
    return res.status(200).json({
      getThread,
    });
  } catch (error) {
    console.log(error);
  }
};
//게시물 생성
const createThreads = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      const error = new Error("TOKEN_ERROR");
      error.statusCode = 400;
      error.code = "TOKEN_ERROR";
      throw error;
    }

    const { id } = jwt.verify(token, process.env.TYPEORM_JWT);

    const { content } = req.body;
    if (content.length === 0) {
      const error = new Error("CONTENT_TOO_SHORT");
      error.statusCode = 400;
      error.code = "CONTENT_TOO_SHORT";
      throw error;
    }

    // 포스팅 내용 저장
    const newPost = await myDataSource.query(`
        INSERT INTO threads (
            user_id,
            content
        ) VALUES (
            '${id}',
            '${content}'   
        );
        `);

    console.log("new Post ID : ", newPost.id);
    console.log("new Post Content : ", newPost.content);

    return res.status(200).json({
      code: "writingSuccess",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = {
  readThreads,
  createThreads,
};
