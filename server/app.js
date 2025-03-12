const express = require('express')
const app = express()

app.use(express.json())

console.log("hello")

app.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = app