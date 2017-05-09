# passport-line-v2

Passport strategy for login using line api (version 2). Some part of code is copies from [https://www.npmjs.com/package/passport-line](https://www.npmjs.com/package/passport-line).

# Pre-requisite

  - need to create line business account [business.line.me](business.line.me)
  - after register to the line business account, you will get `line channel id` and `line secret`, we will use both value later
  - from [https://developers.line.me](https://developers.line.me), at `Technical Configuration` tab, we need to add `callback url`
  - official documentation is available at [https://developers.line.me/line-login/overview](https://developers.line.me/line-login/overview) 

# How to run example code

clone project
```sh
git clone https://github.com/piggyman007/passport-line-v2.git
```

modify some parameters at `/example/index.js`
```javascript
const LINE_CHANNEL_ID = 'put your line channel id here'
const LINE_CHANNEL_SECRET = 'put your line channel secret here'
const CALLBACK_URL = 'your call back url' // e.g., https:www.somedomain.com or https://1.2.3.4
```
> - `callback url` cannot be localhost or 127.0.0.1
> - `callback url` must be https protocal
> - `callback url` must be the same value as specify in the `Pre-requisite` section

the example code is located at `/example` folder, goto it
```sh
cd example
```

install dependency modules
```sh
npm i
```

start app
```sh
npm start
```

the application will start on port `5000`

# Sample usage code

sample usage code below is from `/example/index.js`

```javascript
/** decaration part */

// specify some parameters here
const LINE_CHANNEL_ID = 'put your line channel id here'
const LINE_CHANNEL_SECRET = 'put your line channel secret here'
const CALLBACK_URL = 'your call back url' // e.g., https:www.somedomain.com or https://1.2.3.4

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

/** set up express part */

// init passport
app.use(passport.initialize())
app.use(passport.session())

/** routes part */

// authenticate with line service
app.get('/auth/line', passport.authenticate(passportLine.NAME))

/**
 * line service will redirect to this callback api
 * if failed, goto /login
 * if pass, redirect to /
*/
app.get('/auth/line/callback',
  passport.authenticate(passportLine.NAME, { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/')
  }
)
```

License
----

MIT
