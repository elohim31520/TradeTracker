import { CronJob as CronJobClass } from 'cron'
const CronJob = require('cron').CronJob
const { fetchTnews, fetchStatements, fetchMarketIndex, fetchCMNews } = require('./src/js/crawler')

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

createCronJob({
	schedule: '28 11-18/3 * * *',
	mission: fetchTnews,
})

createCronJob({
	schedule: '30 10-20 * * *',
	mission: fetchStatements,
})

createCronJob({
	schedule: '35 * * * *',
	mission: fetchMarketIndex,
})

// createCronJob({
// 	schedule: '48 11-18/3 * * *',
// 	mission: fetchCMNews,
// })