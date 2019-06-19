const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
        title: {
            type: DataTypes.STRING
        },
        showId: {
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
        }
    })

    return Subscription
}