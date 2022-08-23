const { authenticate } = require('./authenticate')
const { login } = require('./login')
const { logout } = require('./logout')
const { discordResponse } = require('./discord')
const { oauth2Authorize, oauth2Response } = require('./oauth2')
const { oidcAuthorize, oidcResponse } = require('./oidc')
const { signup } = require('./signup')

module.exports = { authenticate, login, logout, discordResponse, oauth2Authorize, oauth2Response, oidcAuthorize, oidcResponse, signup }