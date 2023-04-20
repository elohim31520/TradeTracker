const Records = require("../../modal/records");
const sequelize = require("../../js/connect");


function sqlGet(userId) {
    return sequelize.query(
        `SELECT * from records WHERE userId = :id;`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: userId }
        }
    )
}

function sqlUpdate(params) {
    return Records.update(params, {
        where: {
            id: params.id
        }
    })
}

function sqlCreate(params) {
    return sequelize.sync().then(() => {
        return Records.create(params)
    })
}

function sqlBulkCreate(arr) {
    return sequelize.sync().then(() => {
        return Records.bulkCreate(arr)
    })
}


function sqlDelete({id, userId}) {
    return Records.destroy({
        where: {
            id,
            userId
        }
    })
}

function sqlGetAvg(userId) {
    return sequelize.query(
        `SELECT
            AVG(price) as average_price ,
            ROUND(SUM(share), 2) as Total_share,
            ROUND(SUM(total), 2) as Total_account,
            company,
            userId
            FROM records WHERE userId = :id GROUP BY company`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: userId }
        }
    )
}

module.exports = {
    sqlCreate,
    sqlUpdate,
    sqlGet,
    sqlDelete,
    sqlGetAvg,
    sqlBulkCreate
}