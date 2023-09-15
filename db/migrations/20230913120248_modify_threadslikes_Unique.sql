-- migrate:up
ALTER TABLE thread_likes ADD CONSTRAINT unique_user_thread  UNIQUE (user_id, thread_id)

-- migrate:down

