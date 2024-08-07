const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Statements = sequelize.define("Statements", {
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt :{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Market_Cap : {
        type: DataTypes.STRING,
    },
    Income : {
        type: DataTypes.STRING,
    },
    Sales : {
        type: DataTypes.STRING,
    },
    Book_sh: {
        type: DataTypes.STRING,
    },
    Cash_sh : {
        type: DataTypes.STRING,
    },
    Dividend : {
        type: DataTypes.STRING,
    },
    Dividend_percent : {
        type: DataTypes.STRING,
    },
    Employees : {
        type: DataTypes.STRING,
    },
    Recom : {
        type: DataTypes.STRING,
    },
    PE : {
        type: DataTypes.STRING,
    },
    Forward_PE : {
        type: DataTypes.STRING,
    },
    PEG : {
        type: DataTypes.STRING,
    },
    PS : {
        type: DataTypes.STRING,
    },
    PB : {
        type: DataTypes.STRING,
    },
    PC : {
        type: DataTypes.STRING,
    },
    PFCF : {
        type: DataTypes.STRING,
    },
    Quick_Ratio : {
        type: DataTypes.STRING,
    },
    Current_Ratio : {
        type: DataTypes.STRING,
    },
    DebtEq : {
        type: DataTypes.STRING,
    },
    LT_DebtEq : {
        type: DataTypes.STRING,
    },
    EPS_ttm : {
        type: DataTypes.STRING,
    },
    EPS_next_Y : {
        type: DataTypes.STRING,
    },
    EPS_next_Q  : {
        type: DataTypes.STRING,
    },
    EPS_this_Y : {
        type: DataTypes.STRING,
    },
    EPS_grow_next_Y : {
        type: DataTypes.STRING,
    },
    EPS_next_5Y : {
        type: DataTypes.STRING,
    },
    EPS_past_5Y : {
        type: DataTypes.STRING,
    },
    Sales_past_5Y : {
        type: DataTypes.STRING,
    },
    Sales_QQ : {
        type: DataTypes.STRING,
    },
    EPS_QQ : {
        type: DataTypes.STRING,
    },
    Insider_Own : {
        type: DataTypes.STRING,
    },
    Insider_Trans : {
        type: DataTypes.STRING,
    },
    Inst_Own : {
        type: DataTypes.STRING,
    },
    Inst_Trans : {
        type: DataTypes.STRING,
    },
    ROA : {
        type: DataTypes.STRING,
    },
    ROE : {
        type: DataTypes.STRING,
    },
    ROI : {
        type: DataTypes.STRING,
    },
    Gross_Margin : {
        type: DataTypes.STRING,
    },
    Oper_Margin : {
        type: DataTypes.STRING,
    },
    Profit_Margin : {
        type: DataTypes.STRING,
    },
    Payout : {
        type: DataTypes.STRING,
    },
    Shs_Outstand : {
        type: DataTypes.STRING,
    },
    Shs_Float : {
        type: DataTypes.STRING,
    },
    Short_Ratio : {
        type: DataTypes.STRING,
    },
    Target_Price : {
        type: DataTypes.STRING,
    },
    RSI_14 : {
        type: DataTypes.STRING,
    },
    Rel_Volume : {
        type: DataTypes.STRING,
    },
    Avg_Volume : {
        type: DataTypes.STRING,
    },
    Volume : {
        type: DataTypes.STRING,
    },
    Beta : {
        type: DataTypes.STRING,
    },
    ATR : {
        type: DataTypes.STRING,
    },
    company: {
        type: DataTypes.STRING,
    },
});

module.exports = Statements