const express = require('express')
const app = express()

console.log("hello")

app.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = app