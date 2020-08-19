const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()


//router import
const userRouter = require('./authRoutes/userAuthRoutes')


const app = express()
const cors = require('cors')

//.env config
const PORT = process.env.PORT || 9000
const mongoURI = process.env.MONGODB_URI

app.use(cors());


//middleware
app.use(express.urlencoded({extended: true}))
app.use(morgan("tiny"))
app.use(express.json())
app.use('/auth', userRouter)

app.get('/', (req, res) => {
    res.send('hello world')
  })
  

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