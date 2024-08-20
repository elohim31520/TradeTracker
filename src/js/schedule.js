const dayjs = require('dayjs')

class Schedule {
    constructor({ countdown, gap, gapUnit, lastTime }) {
        this.lastTime = lastTime
        this.timeoutID = null
        this.countDownSecond = countdown
        this.gap = gap || 24
        this.gapUnit = "hour" || gapUnit
    }

    interval(callback) {
        if (typeof callback != "function") {
            console.log(typeof callback);
            console.log("interval callback 類型有誤");
            return
        }
        callback()
        this.timeoutID = setInterval(() => {
            callback()
        }, this.countDownSecond * 1000)
    }

    removeInterval() {
        clearInterval(this.timeoutID)
    }

    setLastTime(lastTime) {
        this.lastTime = lastTime
    }

    setTimestampStr(now) {
        this.timeStampStr = now || dayjs().format('YYYY-MM-DD HH_mm_ss')
    }

    // isExpired (time){
    //     return this.timeStamp.subtract(10,"hour").isAfter(dayjs(time))
    // }

    isTimeToGet() {
        if (!this.lastTime) return true
        return dayjs().isAfter(dayjs(this.lastTime).add(this.gap, this.gapUnit))
    }

    isAfterTime({ gap, gapUnit }) {
        return dayjs().isAfter(dayjs(this.lastTime).add(gap, gapUnit))
    }
}

module.exports = Schedule