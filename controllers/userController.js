const express = require("express")
const userControllerRouter = express.Router()
const User = require('../models/User')

//get User information
userControllerRouter.get('/:id',  async (req, res) => {
    const id = req.params.id
    await User.findById(id,  (err, userDetails) => {
        if (err) {
            res.status(400).json({error: err.message})
        }
        if (!userDetails) {
            res.status(400).json({error: "User do not exist"})
        }


        res.status(200).json(userDetails) 
    })
})

//update user information
userControllerRouter.put('/:id', async (req, res) => {
    const id = req.params.id
    await User.findByIdAndUpdate(id, req.body, {new: true}, (err, userDetails) => {
        if (err) {
            res.status(400).json({error: err.message})
        }
        res.status(200).json(userDetails)
    })
})


module.exports = userControllerRouter