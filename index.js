const express = require('express');
const app = express()
const axios = require("axios")
const cookieParser = require('cookie-parser');
const config = require("./config.json")
const letmeauth = require("../Lib")
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
    const result = await letmeauth.checkToken({
        token : req.cookies.token,
        app_id : config.app_id
    }).then(async result => {
        if (result.id) {
            req.user = result
            return next()
        }
        return res.redirect("/login")
    })
}
app.listen(config.port, () => {
    console.log(`Working at port ${config.port}`)
})