SELECT Users.userID, Users.createdAt, Company.name
FROM Users
JOIN User_subscribe_company ON Users.userId = User_subscribe_company.userId
JOIN Company ON User_subscribe_company.symbol = Company.symbol;