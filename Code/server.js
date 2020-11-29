const express = require('express')
const app = express()

app.use(express.json())

const sortierenRouter = require('./routes/sortieren')
app.use('/sortieren', sortierenRouter)

app.listen(3000, () => console.log('Server gestartet'))