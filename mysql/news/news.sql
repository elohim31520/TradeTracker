CREATE TABLE News(
    id INT NOT NULL AUTO_INCREMENT,
    md5 VARCHAR(128),
    release_time VARCHAR(128),
    company VARCHAR(16),
    title VARCHAR(512),
    publisher VARCHAR(128),
    web_url VARCHAR(512),
    PRIMARY KEY (id),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);