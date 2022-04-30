const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3001
const cors = require("cors")
app.use(cors())

// connecting to atlas
require('./db/dbConnections')

// cookie middleware
app.use(cookieParser())

// Checking if Build folder from client side exists or not
const BuildExistence = fs.existsSync(
  path.join(__dirname, '..', 'client', 'build'),
)
if (BuildExistence === false) {
  console.log("WARN: Build Folder Doesn't exists")
  console.log('WARN: run `npm run build` in client folder\n')
}

// Enabling Express to read req body as json
app.use(express.json())

// Root ('/') Path
const client = require('./routes/client')
const logger = require('./logger')
app.use('/', client)

// user route
app.use('/api/users/', require('./routes/userRoute'))

// game route
app.use('/api/game/', require('./routes/GameRoute'))

// leaderboard
app.use('/api/', require('./routes/LeaderBoardRoute'))

// Serving files from ../client/build
// Which can be created by running `npm run build` in client folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

app.listen(PORT, (err) => {
  if (err) {
    logger.fatal('unable to to listen to port, Error:', err)
    throw err
  }
  logger.info(`listening in ${PORT}`)
})
