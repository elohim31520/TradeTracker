CREATE TABLE User_subscribe_company(
    userId  VARCHAR(32) NOT NULL,
    symbol  VARCHAR(4) NOT NULL,
	PRIMARY KEY (userId, symbol),
	FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE,
	FOREIGN KEY(symbol) REFERENCES Company(symbol) ON DELETE CASCADE
);