require('dotenv').config()

const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const cors = require('cors')

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  })

const app = express()

// Middleware Setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors({
  origin: [process.env.CLIENT_URL],
  credentials: true
}))

// Passport Facebook Strategy
passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

app.use(passport.initialize())

// Enable authentication using session + passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(flash())
require('./passport')(app)

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const postRoutes = require('./routes/post')
app.use('/post', postRoutes)

const profileRoutes = require('./routes/profile')
app.use('/profile', profileRoutes)

const categoryRoutes = require('./routes/categories')
app.use('/categories', categoryRoutes)

const spotsRoutes = require('./routes/spot')
app.use('/spot', spotsRoutes)

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

module.exports = app
