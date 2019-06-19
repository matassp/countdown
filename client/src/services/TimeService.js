var moment = require('moment');
moment().format();

export default {
    getMillis(date) {
        const currentMoment = moment().utc()
        const airMoment = moment.utc(date, moment.ISO_8601)
        const duration = moment.duration(airMoment.diff(currentMoment))
        return duration.asMilliseconds()
    }
}