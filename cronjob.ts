import { CronJob as CronJobClass } from 'cron'
import cron from 'cron'
import { crawlMarketIndex } from './src/modules/crawler/marketIndex'
import { crawlCompanyMetrics } from './src/modules/crawler/companyMetrics'
import { crawlStockPrices } from './src/modules/crawler/stockPrices'

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

if(process.env.NODE_ENV === 'production') {
	createCronJob({
		schedule: '30 1 * * *',
		mission: crawlCompanyMetrics,
	})
	
	createCronJob({
		schedule: '*/15 * * * *',
		mission: crawlMarketIndex,
	})
	
	createCronJob({
		schedule: '0 2 * * *',
		mission: crawlStockPrices,
	})
} else {
	createCronJob({
		schedule: '30 * * * *',
		mission: crawlCompanyMetrics,
	})
	
	createCronJob({
		schedule: '*/10 * * * *',
		mission: crawlMarketIndex,
	})
	
	createCronJob({
		schedule: '0 * * * *',
		mission: crawlStockPrices,
	})
}
