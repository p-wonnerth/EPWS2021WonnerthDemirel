require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Mit Datenbank verbunden'))

app.use(express.json())

const sortierenRouter = require('./routes/sortieren')
app.use('/sortieren', sortierenRouter)

const testRouter = require('./routes/test')
app.use('/test', testRouter)

const kassenbonRouter = require('./routes/kassenbon')
app.use('/kassenbon', kassenbonRouter)

app.listen(3000, () => console.log('Server gestartet'))