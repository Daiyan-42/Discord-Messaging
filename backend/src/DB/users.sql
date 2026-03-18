create table users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

ALTER TABLE users 
  ADD COLUMN display_name text, -- if null, frontend should fallback to username
  ADD COLUMN date_of_birth date NOT NULL DEFAULT '1900-01-01';

ALTER TABLE users 
  ADD CONSTRAINT users_username_key UNIQUE (username); -- make username unique

create index idx_users_email on users(email); -- index for faster lookup for login