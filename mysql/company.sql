CREATE TABLE Company(
    symbol VARCHAR(4) NOT NULL UNIQUE,
    name VARCHAR(32),
    PRIMARY KEY (symbol)
);