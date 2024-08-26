import dayjs, { ManipulateType } from 'dayjs'

interface ScheduleOptions {
	countdown: number
	gap?: number
	gapUnit?: dayjs.UnitType
	lastTime?: string | Date
}

class Schedule {
	private lastTime: dayjs.Dayjs
	private timeoutID: NodeJS.Timeout | null = null
	private gap: number
	private gapUnit: dayjs.UnitType
	private countdownSeconds: number

	constructor({ countdown, gap = 24, gapUnit = 'hour', lastTime }: ScheduleOptions) {
		this.lastTime = dayjs(lastTime)
		this.countdownSeconds = countdown
		this.gap = gap
		this.gapUnit = gapUnit
	}

	startInterval(callback: () => void): void {
		if (typeof callback !== 'function') {
			console.error('Interval callback type is invalid')
			return
		}
		callback()
		this.timeoutID = setInterval(callback, this.countdownSeconds * 1000)
	}

	removeInterval() {
		if (this.timeoutID) {
			clearInterval(this.timeoutID)
			this.timeoutID = null
		}
	}

	updateLastTime(lastTime: string | Date): void {
		this.lastTime = dayjs(lastTime)
	}

	isAfterTime(gap: number, gapUnit: ManipulateType): boolean {
		if (!this.lastTime) return false
		return dayjs().isAfter(this.lastTime.add(gap, gapUnit))
	}
}

export default Schedule
