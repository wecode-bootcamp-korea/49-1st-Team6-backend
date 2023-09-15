-- migrate:up
ALTER TABLE thread_likes ADD CONSTRAINT UNIQUE unique_user_thread (user_id, thread_id)

-- migrate:down

