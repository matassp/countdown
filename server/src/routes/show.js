const express = require('express')
const request = require('request')
const moment = require('moment')

const router = express.Router()

router.get('/:title', async (req, res) => {
    try {
        const id = await getShowId(req.params.title)
        const show = await getShow(id)
        res.send(show)
    } catch (e) {
        res.send(e)
    }
})

const getShowId = (title) => {
    const url = "https://www.episodate.com/api/search?q=" + title
    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body }) => {
            if (error)
                reject('Cant connect')
            if (body.total == 0)
                return reject('No matches')
            resolve(body.tv_shows[0].id)
        })
    })
}

const getShow = (id) => {
    const url = 'https://www.episodate.com/api/show-details?q=' + id
    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body }) => {
            if (error)
                reject('Cant connect')
            resolve({
                name: body.tvShow.name,
                permalink: body.tvShow.permalink,
                status: body.tvShow.status,
                countdown: body.tvShow.countdown ? moment.duration(Math.abs(new Date() - Date.parse(body.tvShow.countdown.air_date + ' GMT'))).humanize(true) : null
            })
        })
    })
}

module.exports = router