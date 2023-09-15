-- migrate:up
ALTER TABLE users MODIFY COLUMN email varchar(200) NOT NULL UNIQUE

-- migrate:down