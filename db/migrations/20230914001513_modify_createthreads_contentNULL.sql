-- migrate:up
ALTER TABLE threads MODIFY COLUMN content TEXT NULL

-- migrate:down

