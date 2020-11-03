CREATE DATABASE socialnetwork;
\c socialnetwork

CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION pgcrypto;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    login VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL
);

CREATE TABLE tokens(
    token UUID DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE
);

CREATE TABLE followings(
    follower_id INTEGER REFERENCES users(id),
    followed_id INTEGER REFERENCES users(id),
    PRIMARY KEY (follower_id, followed_id)
);

CREATE TABLE profiles(
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(64) DEFAULT '',
    last_name VARCHAR(64) DEFAULT '',
    about TEXT DEFAULT '',
    photo_url VARCHAR(256) DEFAULT ''
);

CREATE TABLE contacts(
    user_id INTEGER REFERENCES users(id),
    github VARCHAR(64) DEFAULT '',
    telegram VARCHAR(32) DEFAULT '',
    email VARCHAR(64) DEFAULT '',
    vk VARCHAR(64) DEFAULT '',
    instagram VARCHAR(64) DEFAULT ''
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    title VARCHAR(128),
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats_members(
    user_id INTEGER REFERENCES users(id),
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, chat_id)
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    content TEXT,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories(
    name VARCHAR(16) PRIMARY KEY
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(16) REFERENCES categories(name),
    content TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE replies(
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_likes(
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, post_id)
);

CREATE TABLE comment_likes(
    user_id INTEGER REFERENCES users(id),
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, comment_id)
);

CREATE TABLE reply_likes(
    user_id INTEGER REFERENCES users(id),
    reply_id INTEGER REFERENCES replies(id),
    PRIMARY KEY(user_id, reply_id)
);

INSERT INTO categories VALUES
    ('Programming'),
    ('Travels'),
    ('Countries'),
    ('Languages'),
    ('Politics'),
    ('News'),
    ('Blog'),
    ('Stories'),
    ('Music'),
    ('Education'),
    ('Science'),
    ('Films'),
    ('Cinema'),
    ('Theater'),
    ('Tourism'),
    ('Statistics'),
    ('Philosophy'),
    ('Literature'),
    ('Psychology'),
    ('Other'),
    ('No category');
