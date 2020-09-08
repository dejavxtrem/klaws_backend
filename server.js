const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const expressJwt = require("express-jwt")
const cors = require('cors')



//Auth route import
const userRouter = require('./authRoutes/userAuthRoutes')
const nailTechRouter = require('./authRoutes/nailArtistAuthRoute')

//Account profile imports
const userControllerRouter = require('./controllers/userController')
const userAvatarRouter = require('./controllers/userAvatar')
const nailServiceRouter = require('./controllers/addNailService')




const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors());
app.use(morgan("tiny"))


//.env config
const PORT = process.env.PORT || 9000
const mongoURI = process.env.MONGODB_URI





//middleware
app.use("/api", expressJwt({secret: process.env.SECRET, algorithms: ['HS256']}))
//auth router middleware
app.use('/auth', userRouter)
app.use('/nailauth', nailTechRouter)

app.use('/upload', express.static('uploads'));


//User profile Router
app.use("/api/useraccount", userControllerRouter)
app.use("/api/useravatar", userAvatarRouter)
app.use("/api/nailartist", nailServiceRouter )

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