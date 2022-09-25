const express = require('express');
const app = express()
const axios = require("axios")
const cookieParser = require('cookie-parser');
const config = require("./config.json")
const letmeauth = require("letmeauth")
app.set('view engine', 'ejs');
app.use(cookieParser())


app.get("/", checkAuth, async (req, res) => {
    res.json(req.user)
})
app.get("/login", async (req, res) => {
    letmeauth.getOauth2URL({
        app_id: config.app_id,
        callback: config.callback_url
    })
    .then((r) => {
        return res.redirect(r.url)
    })
})
app.get("/callback", async (req, res) => {
    res.cookie("token", req.query.token)
    return res.redirect(req.cookies.redirect ? req.cookies.redirect : '/')
})
async function checkAuth(req, res, next) {
    letmeauth.checkToken({
        token: req.cookies.token,
        app_id: config.app_id
    }).then(async result => {
        if (result.error) {
            console.log(result.error)
            return res.sendStatus(500)
        } else if (result.user) {
            req.user = result.user
            return next()
        }
        return res.redirect("/login")
    })
}
app.listen(config.port, () => {
    console.log(`Working at port ${config.port}`)
})