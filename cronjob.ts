import { CronJob as CronJobClass } from 'cron';
const CronJob = require('cron').CronJob
const { fetchTnews, fetchStatements, fetchMarketIndex } = require('./js/crawler')

// 定义参数类型
interface CronJobConfig {
	schedule: string | undefined
	mission: () => void
}

function createCronJob({ schedule, mission }: CronJobConfig): CronJobClass {
	if (!schedule) {
		throw new Error('Schedule is required')
	}
	const job = new CronJob(schedule, mission, null, true, 'Asia/Taipei')
	return job
}

// const CRONJOB_FINZ = '57 10-20 * * *'

const CRONJOB_TECHNEWS = '50 11-18/3 * * *'

const CRONJOB_SP500 = '15 10-20 * * *'

const CRONJOB_MARKET_INDEX = '0 * * * *'


createCronJob({
	schedule: CRONJOB_TECHNEWS,
	mission: fetchTnews,
})

createCronJob({
	schedule: CRONJOB_SP500,
	mission: fetchStatements,
})

createCronJob({
	schedule: CRONJOB_MARKET_INDEX,
	mission: fetchMarketIndex,
})