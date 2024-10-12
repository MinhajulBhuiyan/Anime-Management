CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE anime (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    anime_title VARCHAR(100) NOT NULL,
    description VARCHAR(256),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
