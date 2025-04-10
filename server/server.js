const app = require('./app')
require('dotenv').config()
const db = require('./config/db')


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})  