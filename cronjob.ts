import { CronJob as CronJobClass } from 'cron'
import cron from 'cron'
import { crawlMarketIndex } from './src/modules/crawler/marketIndex'
import { crawlCompanyMetrics } from './src/modules/crawler/companyMetrics'
import { crawlStockPrices } from './src/modules/crawler/stockPrices'
import { crawlTechNews } from './src/modules/crawler/technews'

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

if (process.env.NODE_ENV === 'production') {
	createCronJob({
		schedule: '0 15 * * *',
		mission: crawlCompanyMetrics,
	})

	createCronJob({
		schedule: '*/10 * * * *',
		mission: crawlMarketIndex,
	})

	// 早上 11:00 更新 stock prices，原因是爬蟲的網站可能是美東晚上才更新
	createCronJob({
		schedule: '0 8,12 * * *',
		mission: crawlStockPrices,
	})

	createCronJob({
		schedule: '41 */6 * * *',
		mission: crawlTechNews,
	})
} else {
	createCronJob({
		schedule: '0 * * * *',
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

	createCronJob({
		schedule: '41 * * * *',
		mission: crawlTechNews,
	})
}
