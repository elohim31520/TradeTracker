const News = require("../../modal/news")
const TechNews = require("../../modal/techNews")
const Statements = require("../../modal/statements")
const sequelize = require("../../js/connect");
const { md5Encode } = require("../../js/crypto");
const dayjs = require("dayjs")
const { Op } = require("sequelize");
const Users = require("../../modal/user")
const Company = require("../../modal/company")
const User_favorite_news = require("../../modal/many_to_many/user_favorite_news")
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
			console.error("檢查資料庫新聞是否重複 - 失敗");
		}
	})
}

function sqlFindOne(conditions) {
	return News.findOne({
		where: conditions
	})
}

function sqlCreateNews({ md5, releaseTime, company, title, publisher, webUrl }) {
	News.create({
		md5,
		release_time: releaseTime,
		company,
		title,
		publisher,
		web_url: webUrl,
	}, {
		logging: false,
	}).then(res => {
		logger.info(`SQL寫入News成功: ${title}`)
	}).catch(e => {
		console.log(error);
		console.error('SQL寫入News失敗')
	});
}

function sqlCreateStatements(param) {
	return Statements.create(param).catch((error) => {
		console.log(e);
		console.error(e)
		console.error('SQL寫入Statements失敗');
	});
}

const mustFilterdTxt = "Right Now|why today|As Market Dips |Before Betting on It| To Buy Now |How Much You Would Have Today|What You Should Know |Stocks to Buy|Stock a Buy Now"

async function sqlQuerySingleCompanyNews(symbol, title = "%") {
	const eObj = { code: -1, message: 'no symbol', method: "sqlQuerySingleCompanyNews" }
	if (!symbol) {
		return Promise.reject(eObj)
	}
	try {
		const res = await News.findAll({
			where: {
				company: symbol,
				title: {
					[Op.like]: `%${title}%`,
					[Op.notRegexp]: mustFilterdTxt
				}
			},
			attributes: ['company', 'title', 'web_url', 'release_time'],
			order: [['createdAt', 'DESC']]
		})
		return res
	} catch (e) {
		eObj.message = e.message
		return Promise.reject(eObj)
	}
}

async function sqlQueryRange({ method = 'GET', body = {} } = {}) {
	let { endDate, startDate } = body

	if (method == 'POST') {
		endDate = dayjs(endDate).toDate()
		startDate = dayjs(startDate).toDate()
	} else {
		endDate = dayjs(endDate).subtract(1, 'day').toDate()
		startDate = dayjs(startDate).subtract(4, 'day').toDate()
	}
	try {
		const res = await News.findAll({
			where: {
				createdAt: {
					[Op.between]: [startDate, endDate],
				}
			},
			attributes: [
				'id', 'title', 'company', 'publisher', 'web_url',
				[
					sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m-%d')`),
					'createdAt'
				]
			],
		})
		return res
	} catch (error) {
		console.error(error);
		console.log("查詢日期範圍失敗");
	}
}

async function sqlQuerySubscriptionNews(body) {
	const { userId, pageIndex, pageSize, startDate, endDate, title, company } = body

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
					[Op.like]: `%${title}%`
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
		console.log(e);
		console.log("查詢關聯數據失敗");
	}
}

function sqlCreateTechNews(arr) {
	arr.forEach(async vo => {
		try {
			await TechNews.create(vo)
			console.log("SQL寫入technews成功 ", vo.title)
		} catch (e) {
			logger.error(`SQL寫入technews失敗: ${e.message}`)
		}
	})
}

async function sqlGetUserFavoriteNews(body) {
	const { userId } = body
	try {
		const user = await Users.findByPk(userId, {
			include: {
				model: News,
				attributes: ["id"],
				through: { attributes: [] }
			}
		})

		const allNewsId = user.News.map(vo => vo.id)

		const res = News.findAll({
			where: {
				id: allNewsId
			}
		})

		return res
	} catch (e) {
		console.log(e);
		console.log("sqlGetUserFavoriteNews 關聯失敗");
	}
}

async function sqlSetUserFavoriteNews(body) {
	try {
		const res = await User_favorite_news.create(body)
		console.log(res);
		return res
	} catch (e) {
		console.log(e);
		console.log("sqlSetUserFavoriteNews 寫入失敗");
	}
}

module.exports = {
	sqlWrite,
	sqlQuerySingleCompanyNews,
	sqlCreateStatements,
	sqlQueryRange,
	sqlQuerySubscriptionNews,
	sqlCreateTechNews,
	sqlGetUserFavoriteNews,
	sqlSetUserFavoriteNews
}


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
// 		console.log("查詢今日失敗");
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