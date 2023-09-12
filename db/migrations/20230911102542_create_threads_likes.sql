-- migrate:up
CREATE TABLE thread_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  thread_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (thread_id) REFERENCES threads(id),
  UNIQUE KEY unique_user_thread (user_id, thread_id)
);

-- migrate:down

