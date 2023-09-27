const SequelizeInstance = require("sequelize");
const logger = require("../logger");

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
	logger.info('Sql Connection has been established successfully.')
}).catch((error) => {
	logger.error('Unable to connect to the database: ' + error.message )
});

module.exports = sequelize