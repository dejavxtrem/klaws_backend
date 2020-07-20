const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const app = express()


//.env config
const PORT = process.env.PORT || 9000
const mongoURI = process.env.MONGODB_URI

app.use(cors());


//middleware
app.use(express.urlencoded({extended: true}))
app.use(morgan('tiny'))
app.use(express.json())


//controllers


//Mongoose connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


mongoose.connection.once('open', () => {
    console.log('connected to mongo')
})

app.listen(PORT, () => {
    console.log('🎉🎊', 'celebrations happening on port', PORT, '🎉🎊',)
})