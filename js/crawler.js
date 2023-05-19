const cheerio = require('cheerio')
const Fetch = require('./fetch')
const { createDir, writeFile } = require("./file");
const { dbDir, requestUrl, stockSymbols } = require("./config");
const Schedule = require("./schedule");
const { getTimeNow } = require("./util");
const { sqlWrite, sqlCreateStatements } = require("../crud/news");
const dayjs = require('dayjs')

function parseHtmltoData(html, symbo) {
    const $ = cheerio.load(html);
    let rows = $('#news-table tr')
    let arr = []
    let date = null
    for (let i = 0; i < rows.length; i++) {
        const td = rows.eq(i).find('td')
        const atag = $(td).find("a")
        let time = td.eq(0).text(),
            title = atag.text(),
            publisher = $(td).find(".news-link-right").text(),
            webUrl = atag.attr('href')
        if (!/-/g.test(time)) time = `${date} ${time}`
        else date = time.split(" ")[0]
        arr.push({ releaseTime: time, title, publisher, webUrl, company: symbo })
    }
    return arr
};

var map = {
    "Market Cap": "Market_Cap",
    "Income": "Income",
    "Sales": "Sales",
    "Book/sh": "Book_sh",
    "Cash/sh": "Cash_sh",
    "Dividend": "Dividend",
    "Dividend %": "Dividend_percent",
    "Employees": "Employees",
    "Recom": "Recom",
    "P/E": "PE",
    "Forward P/E": "Forward_PE",
    "PEG": "PEG",
    "P/S": "PS",
    "P/B": "PB",
    "P/C": "PC",
    "P/FCF": "PFCF",
    "Quick Ratio": "Quick_Ratio",
    "Current Ratio": "Current_Ratio",
    "Debt/Eq": "DebtEq",
    "LT Debt/Eq": "LT_DebtEq",
    "EPS (ttm)": "EPS_ttm",
    "EPS next Y": "EPS_next_Y",
    "EPS next Q": "EPS_next_Q",
    "EPS this Y": "EPS_this_Y",
    "EPS next 5Y": "EPS_next_5Y",
    "EPS past 5Y": "EPS_past_5Y",
    "Sales past 5Y": "Sales_past_5Y",
    "Sales Q/Q": "Sales_QQ",
    "EPS Q/Q": "EPS_QQ",
    "Insider Own": "Insider_Own",
    "Insider Trans": "Insider_Trans",
    "Inst Own": "Inst_Own",
    "Inst Trans": "Inst_Trans",
    "ROA": "ROA",
    "ROE": "ROE",
    "ROI": "ROI",
    "Gross Margin": "Gross_Margin",
    "Oper. Margin": "Oper_Margin",
    "Profit Margin": "Profit_Margin",
    "Payout": "Payout",
    "Shs Outstand": "Shs_Outstand",
    "Shs Float": "Shs_Float",
    "Short Ratio": "Short_Ratio",
    "Target Price": "Target_Price",
    "RSI (14)": "RSI_14",
    "Rel Volume": "Rel_Volume",
    "Avg Volume": "Avg_Volume",
    "Volume": "Volume",
    "Beta": "Beta",
    "ATR": "ATR"
}


const mySchedule = new Schedule({ countdown: 60 * 60 })
mySchedule.interval(async () => {
	if(process.env.DEBUG_MODE) return
    console.log(`開始爬蟲，最後創建時間: ${mySchedule.lastTime}`)
    const now = dayjs().format('YYYY-MM-DD HH_mm_ss')
    const myPath = dbDir + now
    try {
        const scheduleSec = new Schedule({ countdown: 8 })
        const myFetch = new Fetch({ requestUrl, stockSymbols }),
            canGet = mySchedule.isTimeToGet(),
            hasTimeLimit = !mySchedule.isAfterTime({ gap: 12, gapUnit: "hour" })
        if(hasTimeLimit) {
            console.log("寫入有12小時限制");
            return
        }
        if (canGet) await createDir(myPath)
        scheduleSec.interval(async () => {
            try {
                const symbo = myFetch.getRequestSymbo()
                if (!symbo) {
                    console.log(`no more symbo，爬蟲結束`)
                    mySchedule.setLastTime()
                    scheduleSec.removeInterval()
                    console.log(myFetch.getAllErrorSymbo());
                    return
                }
                const { data = {} } = await myFetch.getHtml()
                let arr = parseHtmltoData(data, symbo),
                    obj = parseHtmlStatementsTable(data)
                if (!arr) return
                if (canGet) {
                    console.log("寫入.json:", "  現在時間:", getTimeNow(), `寫入路徑: ${myPath}`);
                    try {
                        writeFile(`${myPath}/${symbo}.json`, JSON.stringify(arr, null, 4)) //24小時寫一次檔

                        // 24小時寫一次statements
                        obj.company = symbo
                        console.log("寫入statememts");
                        sqlCreateStatements(obj)
                    } catch (error) {
                        console.log(error);
                        console.log("寫入資料夾失敗");
                    }
                }
                sqlWrite(arr) //12 小時就可以寫sql
            } catch (e) {
                console.log(e);
                console.log("Fetch finviz失敗");
                myFetch.pushErrorSymobo()
                if (e.code == 999) {
                    scheduleSec.removeInterval()
                    return
                }
                myFetch.index++
            }
        })
    } catch (error) {
        console.log("爬蟲暫停");
    }
})

function parseHtmlStatementsTable(html) {
    const $ = cheerio.load(html);
    let keys = $('.snapshot-td2-cp'),
        values = $('.snapshot-td2'),
        obj = {}
    for (let i = 0; i < keys.length; i++) {
        const key = keys.eq(i).text(),
            val = values.eq(i).text(),
            alterKey = map[key.trim()]
        if (alterKey == "EPS next Y" && i > 24) alterKey = "EPS_grow_next_Y"
        if (!alterKey) continue
        obj[alterKey] = val
    }
    return obj
};

module.export = {
    parseHtmlStatementsTable
}