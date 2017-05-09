const express = require('express')
const passport = require('passport')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passportLine = require('passport-line-v2')
const PORT = 5000
const LINE_CHANNEL_ID = '1514100771'
const LINE_CHANNEL_SECRET = 'd654def06d6e0327f42c4db2c13788a5'
const CALLBACK_URL = 'https://163.47.11.69/auth/line/callback'

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

// set up passport using LineStrategy
passport.use(
  new passportLine.Strategy(
    {
      channelID: LINE_CHANNEL_ID,
      channelSecret: LINE_CHANNEL_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile)
    }
  )
)

// set up express
const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.session({ secret: 'so secret' }))

// init passport
app.use(passport.initialize())
app.use(passport.session())

// routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user })
})

app.get('/login', (req, res) => {
  res.render('login', { user: req.user })
})

app.get('/auth/line', passport.authenticate(passportLine.NAME))

app.get('/auth/line/callback',
  passport.authenticate(passportLine.NAME, { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/')
  })

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen(PORT)

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}