import { CronJob as CronJobClass } from 'cron'
import cron from 'cron'
import { fetchStockPrices } from './src/modules/crawler'
import { crawlMarketIndex } from './src/modules/crawler/marketIndex'
import { crawlTechNews } from './src/modules/crawler/technews'
import { crawlCompanyMetrics } from './src/modules/crawler/companyMetrics'
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
	schedule: '30 11-18/3 * * *',
	mission: crawlTechNews,
})

createCronJob({
	schedule: '30 10-20 * * *',
	mission: crawlCompanyMetrics,
})

createCronJob({
	schedule: '*/10 * * * *',
	mission: crawlMarketIndex,
})

createCronJob({
	schedule: '0 * * * *',
	mission: fetchStockPrices,
})