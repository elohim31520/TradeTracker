const News = require("../modal/news")
const Statements = require("../modal/statements")
const sequelize = require("../js/connect");
const { md5Encode } = require("../js/util");
const dayjs = require("dayjs")

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
    }).then(res => {
        console.log("SQL寫入成功 ", company, md5)
    }).catch((error) => {
        console.error('SQL寫入失敗 : ', error);
    });
}

function sqlCreateStatements(param) {
    return Statements.create(param)
}

const mustFilterdTxt = "Right Now|why today|As Market Dips |Before Betting on It| To Buy Now |How Much You Would Have Today|What You Should Know |Stocks to Buy|Stock a Buy Now"

function sqlQueryNews(paramID = 25000) {
    return sequelize.query(
        `SELECT company ,title ,web_url ,release_time FROM news
            WHERE title NOT REGEXP "${mustFilterdTxt}" AND id > :NEWS_ID;`,
        {
            replacements: { NEWS_ID: paramID },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(result => {
        return result
    }).catch((error) => {
        console.error('Failed to query data : ', error);
    });
}

function sqlQuerySingleCompanyNews(paramCode) {
    if (!paramCode) return Promise.reject('code error')
    return sequelize.query(
        `SELECT company ,title ,web_url ,release_time FROM news WHERE company = :SYMBO_CODE
            AND title NOT REGEXP "${mustFilterdTxt}";`,
        {
            replacements: { SYMBO_CODE: paramCode },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(result => {
        return result
    }).catch((error) => {
        console.error('Failed to query data : ', error);
    });
}

function sqlQueryEearningscall() {
    return sequelize.query(
        `SELECT company ,title ,web_url ,release_time FROM news
            WHERE title REGEXP "Earnings Call" order by company;
        `
    )
}

function sqlQueryTodayNews() {
    let now = dayjs().subtract(1, 'day'),
        formatedDate = now.format('MMM-DD-YY')

    return sequelize.query(
        `SELECT company ,title ,web_url ,release_time FROM news WHERE release_time like :TODAY
            AND title NOT REGEXP "${mustFilterdTxt}";`,
        {
            replacements: { TODAY: `${formatedDate}%` },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(result => {
        return result
    }).catch((error) => {
        console.error(error);
        console.log("查詢今日失敗");
    });
}


module.exports = {
    sqlWrite,
    sqlQueryNews,
    sqlQuerySingleCompanyNews,
    sqlCreateStatements,
    sqlQueryEearningscall,
    sqlQueryTodayNews
}