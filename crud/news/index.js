const News = require("../../models/news")
const TechNews = require("../../models/techNews")
const Statements = require("../../models/statements")
const sequelize = require("../../js/connect");
const { md5Encode } = require("../../js/crypto");
const dayjs = require("dayjs")
const { Op } = require("sequelize");
const Users = require("../../models/users")
const Company = require("../../models/company")

const db = require('../../models')

const logger = require("../../logger")

function sqlWrite(arr) {
	arr.forEach(async vo => {
		const md5 = md5Encode(vo.title)
		try {
			const res = await sqlFindOne({ md5 })
			if (res) return
			vo.md5 = md5
			sqlCreateNews(vo)
		} catch (e) {
			logger.error(e.message)
		}
	})
}

function sqlFindOne(conditions) {
	return News.findOne({
		where: conditions
	})
}

async function sqlCreateNews({ md5, releaseTime, company, title, publisher, webUrl }) {
	try {
		await News.create({
			md5,
			release_time: releaseTime,
			company,
			title,
			publisher,
			web_url: webUrl,
		})
	} catch (e) {
		logger.warn(e.message + '		${company}')
	}
}

function sqlCreateStatements(param) {
	return Statements.create(param).catch(e => {
		logger.warn('sqlCreateStatements: ' + e.message)
	});
}

const mustFilterdTxt = "Right Now|why today|As Market Dips |Before Betting on It| To Buy Now |How Much You Would Have Today|What You Should Know |Stocks to Buy|Stock a Buy Now"

async function sqlQueryAll(body = {}) {
	let { pageIndex, pageSize, endDate, startDate, query } = body

	if (!endDate) endDate = dayjs().toDate()
	if (!startDate) startDate = dayjs().startOf('day').subtract(1, 'day').toDate()
	let offset = (pageIndex - 1) * pageSize

	if (pageIndex <= 0) offset = 0
	try {
		const res = await News.findAll({
			where: {
				createdAt: {
					[Op.between]: [startDate, endDate],
				},
				[Op.or]: {
					title: {
						[Op.like]: `%${query}%`
					},
					company: {
						[Op.eq]: query
					}
				}
			},
			offset,
			limit: pageSize,
			attributes: [
				'id', 'title', 'company', 'publisher', 'web_url',
				[
					sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-%d')`),
					'createdAt'
				]
			],
		})
		return res
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
}

async function sqlQuerySubscriptionNews(body) {
	const { userId, pageIndex, pageSize, title, company } = body
	let { startDate, endDate } = body
	try {
		const user = await Users.findByPk(userId, {
			include: {
				model: Company,
				attributes: ['symbol'],
				through: { attributes: [] },
			},
		})

		const companySymbols = user.Companies.map(company => company.symbol);

		if (!endDate) endDate = dayjs().toDate()
		if (!startDate) startDate = dayjs().startOf('day').subtract(1, 'day').toDate()
		let offset = (pageIndex - 1) * pageSize

		if (pageIndex <= 0) offset = 0
		const res = await News.findAll({
			where: {
				company: company || companySymbols,
				title: {
					[Op.like]: `%${title}%`,
					[Op.notRegexp]: mustFilterdTxt
				},
				createdAt: {
					[Op.between]: [startDate, endDate],
				}
			},
			offset,
			limit: pageSize,
			order: [['createdAt']],
			attributes: ['title', 'company', 'release_time', 'web_url', 'createdAt']
		})
		return res
	} catch (e) {
		logger.error(e.message)
		throw new Error(500)
	}
}

function sqlCreateTechNews(arr) {
	arr.forEach(async vo => {
		try {
			await TechNews.create(vo)
		} catch (e) {
			const originalError = e.original
			logger.warn('TechNews.create : ' + originalError.sqlMessage)
			// sql create不須拋出錯誤，且未被寫入的會被catch拋出錯誤，後續的流程會全部中斷
		}
	})
}

async function sqlCompanyStatements(params) {
	try {
		await db.company_statements.create(params)
	} catch (e) {
		logger.warn(e.message + '		${params.symbo}')
	}
}

module.exports = {
	sqlWrite,
	sqlCreateStatements,
	sqlQueryAll,
	sqlQuerySubscriptionNews,
	sqlCreateTechNews,
	sqlCompanyStatements
}


// async function sqlQuerySingleCompanyNews(symbol, title = "%") {
// 	const eObj = { code: -1, message: 'no symbol', method: "sqlQuerySingleCompanyNews" }
// 	if (!symbol) {
// 		return Promise.reject(eObj)
// 	}
// 	try {
// 		const res = await News.findAll({
// 			where: {
// 				company: symbol,
// 				title: {
// 					[Op.like]: `%${title}%`,
// 					[Op.notRegexp]: mustFilterdTxt
// 				}
// 			},
// 			attributes: ['company', 'title', 'web_url', 'release_time'],
// 			order: [['createdAt', 'DESC']]
// 		})
// 		return res
// 	} catch (e) {
// 		logger.error(e.message)
// 		throw new Error(500)
// 	}
// }

// function sqlQueryEearningscall() {
// 	return sequelize.query(`
//         SELECT 
//             company ,title ,web_url ,release_time FROM news
//         WHERE
//             title REGEXP "Earnings Call" order by company;
//         `
// 	)
// }

// async function sqlQueryTodayNews() {
// 	let now = dayjs().subtract(1, 'day'),
// 		formatedDate = now.format('YYYY-MM-DD')

// 	try {
// 		const res = await sequelize.query(`
//             SELECT
//                 company ,title ,web_url ,release_time FROM news 
//             WHERE
//                 createdAt like :TODAY
//                 AND title NOT REGEXP "${mustFilterdTxt}";
//         `,
// 			{
// 				replacements: { TODAY: `${formatedDate}%` },
// 				type: sequelize.QueryTypes.SELECT
// 			}
// 		)
// 		return res
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// function sqlQuerySingleCompanyNews(paramCode) {
// 	return sequelize.query(
// 		`SELECT company ,title ,web_url ,release_time FROM news WHERE company = :SYMBO_CODE
//             AND title NOT REGEXP "${mustFilterdTxt}"
//             ORDER BY createdAt DESC;
//         `,
// 		{
// 			replacements: { SYMBO_CODE: paramCode },
// 			type: sequelize.QueryTypes.SELECT
// 		}
// 	)
// }

// function sqlQueryNews(paramID = 25000) {
// 	return sequelize.query(
// 		`SELECT company ,title ,web_url ,release_time FROM news
//             WHERE title NOT REGEXP "${mustFilterdTxt}" AND id > :NEWS_ID;`,
// 		{
// 			replacements: { NEWS_ID: paramID },
// 			type: sequelize.QueryTypes.SELECT
// 		}
// 	).then(result => {
// 		return result
// 	}).catch((error) => {
// 		console.error('Failed to query data : ', error);
// 	});
// }