const validator = require('validator')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword(user, options) {
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return
    }
    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash)
        })
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                email(value) {
                    if (!validator.isEmail(value) && value != "")
                        throw new Error('Enter a valid email address')
                    else if (value == "")
                        throw new Error('Field is empty')
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                length(value) {
                    if (!validator.isLength(value, { min: 8, max: 32 }))
                        throw new Error('Password should be between 8 and 32 characters long')
                }
            }
        }
    }, {
            hooks: {
                beforeCreate: hashPassword
            }
        })

    User.prototype.comparePassword = async function (password) {
        return bcrypt.compareAsync(password, this.password)
    }

    return User
}