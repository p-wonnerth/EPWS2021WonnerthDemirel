const express = require('express')
const app = express()

app.use(express.json())

const sortierenRouter = require('./routes/sortieren')
app.use('/sortieren', sortierenRouter)

const testRouter = require('./routes/test')
app.use('/test', testRouter)

app.listen(3000, () => console.log('Server gestartet'))