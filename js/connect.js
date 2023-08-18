const SequelizeInstance = require("sequelize");
const sequelize = new SequelizeInstance(
	process.env.DB_NAME,
	'root',
	process.env.DB_PASSWORD,
	{
		host: 'localhost',
		dialect: 'mysql',
		define: {
			// timestamps: false
		},
		timezone: '+08:00',
	}
);

sequelize.authenticate().then(() => {
	console.log('Connection has been established successfully.');
}).catch((error) => {
	console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize