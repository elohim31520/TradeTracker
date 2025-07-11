import { CronJob as CronJobClass } from 'cron'
import cron from 'cron'
import { fetchTnews, fetchStatements, fetchMarketIndex, fetchStockPrices } from './src/modules/crawler'

interface CronConfig {
	schedule: string
	mission: () => void
}

function createCronJob({ schedule, mission }: CronConfig): CronJobClass {
	if (!schedule) {
		throw new Error('Schedule is required')
	}
	const job = new cron.CronJob(schedule, mission, null, true, 'Asia/Taipei')
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
	schedule: '*/10 * * * *',
	mission: fetchMarketIndex,
})

createCronJob({
	schedule: '0 * * * *',
	mission: fetchStockPrices,
})