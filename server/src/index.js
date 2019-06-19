const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./models')
const config = require('./config/config')

const app = express()

// Setting up paths
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(publicDirectoryPath))
app.use(express.json())

const showRouter = require('./routes/show')
app.use('/show', showRouter)

const registerRouter = require('./routes/register')
app.use(registerRouter)

const loginRouter = require('./routes/login')
app.use(loginRouter)

const listRouter = require('./routes/list')
app.use(listRouter)

const subscribeRouter = require('./routes/subscribe')
app.use(subscribeRouter)

const unsubscribeRouter = require('./routes/unsubscribe')
app.use(unsubscribeRouter)

app.get('', (req, res) => {
    res.send("hey")
})

sequelize.sync().then(() => {
    app.listen(config.port, () => {
        console.log('Server is up on port ' + config.port)
    })
})