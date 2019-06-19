const { User } = require('../models')
const { Subscription } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret,
        { expiresIn: ONE_WEEK })
}

module.exports = {
    async register(req, res) {
        try {
            const user = await User.create(req.body)

            const userJSON = user.toJSON()
            res.send({
                user: userJSON,
                token: jwtSignUser(userJSON)
            })
        } catch (e) {
            res.status(400).send({
                error: 'This email is already in use'
            })
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                return res.status(403).send({
                    error: 'Email not registered'
                })
            }

            const isPasswordValid = await user.comparePassword(password)
            console.log(isPasswordValid)
            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'Password incorrect'
                })
            }

            const userJSON = user.toJSON()
            res.send({
                user: userJSON,
                token: jwtSignUser(userJSON)
            })
        } catch (e) {
            res.status(500).send({
                //error: e.errors[0].message
                error: 'Error occured trying to log in'
            })
        }
    },
    async getList(req, res) {
        try {
            //const { token } = req.body
            const id = req.params.id
            console.log(id)
            const user = await User.findOne({
                where: {
                    id: id
                }
            })
            console.log(user)

            const subscriptions = await user.getSubscriptions()
            console.log(subscriptions)

            res.send(subscriptions)
        } catch (e) {
            res.send('Nepavyko ')
        }
    },
    async subscribe(req, res) {
        try {
            const subscription = await Subscription.create(req.body)

            const id = req.body.userId
            const user = await User.findOne({
                where: {
                    id: id
                }
            })

            await user.addSubscription(subscription)

            const subscriptionJSON = subscription.toJSON()
            res.send({
                subscription: subscriptionJSON,
            })
        } catch (e) {
            console.log('nepavyko')
        }
    },
    async unsubscribe(req, res) {
        try {
            const showId = req.body.showId
            const userId = req.body.userId
            console.log(`shod:${showId}, ${userId}`)
            const find = await Subscription.findOne({
                where: {
                    showId: showId,
                    userId: userId
                }
            })
            const destroyed = await find.destroy()
            res.send(destroyed)
        } catch (e) {
            res.send('nepavyko')
        }
    }
}