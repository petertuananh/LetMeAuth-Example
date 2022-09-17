const express = require('express');
const app = express()
const axios = require("axios")
const config = {
    port : 1000,
    application_id : "23987273239305902",
    redirect : 'http://localhost:1000/callback'
}
app.get("/", async (req, res) => {
    res.sendFile(process.cwd() + '/index.html')
})
app.get("/login", async (req, res) => {
    res.redirect(`https://authme.yourauth.xyz/oauth2/authorize?app_id=${config.application_id}&redirect_url=${config.redirect}`)
})
app.get("/callback", async (req, res) => {
    const results = await axios.default.get(`https://authme.yourauth.xyz/oauth2/checktoken?token=${req.query.token}&app_id=${config.application_id}`)
    return res.json(results.data)
})
app.listen(config.port)