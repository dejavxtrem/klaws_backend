const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const expressJwt = require("express-jwt")


//router import
const userRouter = require('./authRoutes/userAuthRoutes')
const userControllerRouter = require('./controllers/userController')


const app = express()
const cors = require('cors')

//.env config
const PORT = process.env.PORT || 9000
const mongoURI = process.env.MONGODB_URI

app.use(cors());


//middleware
app.use("/api", expressJwt({secret: process.env.SECRET, algorithms: ['HS256']}))
app.use('/auth', userRouter)
app.use(express.urlencoded({extended: true}))
app.use(morgan("tiny"))
app.use(express.json())
//User authentication Router

app.use("/api/useraccount", userControllerRouter)

app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        // express-jwt gives the 401 status to the err object for us
        res.status(err.status);
    }
    return res.send({ message: err.message });
});





//controllers




app.get('/', (req, res) => {
    res.send('hello world')
  })


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