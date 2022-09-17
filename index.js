const express = require('express');
const app = express()
const axios = require("axios")
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const config = require("./config.json")
app.use(expressSession({ secret: '#@*#&%#%^%#$##@*#&%#%^%#$##@*#&%#%^%#$#' }))
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(cookieParser())


app.get("/", checkAuth, async (req, res) => {
    res.json(req.user)
})
app.get("/login", async (req, res) => {
    res.redirect(`https://letmeauth.xyz/oauth2/authorize?app_id=${config.app_id}&redirect_url=${config.callback_url}`)
})
app.get("/callback", async (req, res) => {
    res.cookie("token", req.query.token)
    return res.redirect(req.cookies.redirect ? req.cookies.redirect : '/')
})
async function checkAuth(req, res, next) {
    const data = await axios.default.get(`https://letmeauth.xyz/oauth2/checktoken?app_id=${config.app_id}&token=${req.cookies.token}`)
    if (data.data.id) {
        req.user = data.data
        return next()
    }
}
app.listen(3000)