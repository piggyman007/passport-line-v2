'use strict'

const util = require('util')
const OAuth2Strategy = require('passport-oauth2')
const InternalOAuthError = require('passport-oauth2').InternalOAuthError
const shortid = require('shortid')
const NAME = 'line'
const endPoint = {
  WEB_LOGIN: 'https://access.line.me/dialog/oauth/weblogin',
  ACCESS_TOKEN: 'https://api.line.me/v2/oauth/accessToken',
  PROFILE: 'https://api.line.me/v2/profile'
}

function Strategy(options, verify) {
  options = options || {}
  options.clientID = options.channelID
  options.clientSecret = options.channelSecret
  options.authorizationURL = options.authorizationURL || endPoint.WEB_LOGIN
  options.tokenURL = options.tokenURL || endPoint.ACCESS_TOKEN
  options.authorizationURL += `?state=${shortid.generate()}`
  OAuth2Strategy.call(this, options, verify)
  this.name = NAME

  // Use Authorization Header (Bearer with Access Token) for GET requests. Used to get User's profile.
  this._oauth2.useAuthorizationHeaderforGET(true)
}

util.inherits(Strategy, OAuth2Strategy)


/**
 * Retrieve user profile from Line.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - provider         always set to `line`
 *   - id               the user's Line ID
 *   - displayName      the user's full name
 *   - pictureUrl       the user's picture url
 *   - data             all user data
 *
 * @param {String} accessToken
 * @param {Function} done
 */

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(endPoint.PROFILE, accessToken, (err, body, res) => {
    if (err) {
      return done(new InternalOAuthError(err.message, err))
    }
    try {
      const data = JSON.parse(body)
      const profile = {
        provider: NAME,
        pictureUrl: data.pictureUrl,
        id: data.userId,
        displayName: data.displayName,
        data
      }
      done(null, profile)
    }
    catch(e) {
      done(e)
    }
  })
}

module.exports = { 
  Strategy,
  NAME 
}