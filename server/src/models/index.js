const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

fs
    .readdirSync(__dirname)
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

const User = db['User']
const Subscription = db['Subscription']
User.belongsToMany(Subscription, { through: 'UserShow' })
Subscription.belongsToMany(User, { through: 'UserShow' })

db.sequelize = sequelize
db.Sequelize = sequelize
module.exports = db