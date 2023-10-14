CREATE TABLE user (
    id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(34) NOT NULL UNIQUE,
    slug VARCHAR(34) NOT NULL UNIQUE,
    scopes VARCHAR(127) NOT NULL
);
CREATE TABLE user_key (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    hashed_password VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE user_session (
    id VARCHAR(127) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    access_token VARCHAR(127) NOT NULL,
    refresh_token VARCHAR(127) NOT NULL,
    expires_in VARCHAR(17) NOT NULL,
    location_name VARCHAR(127),
    location_token VARCHAR(127),
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);