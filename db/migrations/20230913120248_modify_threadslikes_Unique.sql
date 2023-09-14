-- migrate:up
ALTER TABLE thread_likes ADD CONSTRAINT UNIQUE unique_user_thread (user_id, thread_id)
// 실패한듯, 
-- migrate:down

