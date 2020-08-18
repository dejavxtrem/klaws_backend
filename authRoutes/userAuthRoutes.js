const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const userRouter = express.Router()


userRouter.post('/user/signup', async (req, res) => {
    console.log(req.body)
    
})
