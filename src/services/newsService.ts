const db = require('../../models')
import { NewsAttributes } from '../types/news'

class NewsService {
	async getAllNews() {
		return db.News.findAll()
	}

	async getNewsById(id: string) {
		return db.News.findByPk(id)
	}

	async createNews(news: NewsAttributes) {
		return db.News.create(news)
	}

	async updateNews(id: string, news: NewsAttributes) {
		const [updated] = await db.News.update(news, {
			where: { id },
		})
		if (updated) {
			return db.News.findByPk(id)
		}
		return null
	}

	async deleteNews(id: string) {
		const deleted = await db.News.destroy({
			where: { id },
		})
		return deleted > 0
	}
}

export default new NewsService()
