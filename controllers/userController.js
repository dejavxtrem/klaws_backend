const express = require("express")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nailService = require('../models/addService')
const userControllerRouter = express.Router()




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

//posting user image



//update user information
userControllerRouter.put('/:id', async (req, res) => {
    const id = req.params.id
    await User.findByIdAndUpdate(id, req.body, {new: true}, (err, userDetails) => {
        if (err) {
            return res.status(400).json({error: err.message})
        }
        return res.status(200).json(userDetails)
    })
})


userControllerRouter.patch('/:id', async (req, res) => {
    let password = req.body.password
     bcrypt.genSalt(10,   (err, salt) => {
       if (err) {
         return next(err)
       }
       bcrypt.hash(password, salt, async (err,hash) => {
         if (err) {
           return next(err)
         }
         req.body.password = hash
         console.log(req.body)
   
       await User.updateOne ({_id: req.params.id}, {$set: req.body})
       .then((user) => res.status(200).send({success: true, user, }))
       .catch((err) => res.status(400).send({sucess: false, err: err.message}))
       })
     })
      
     })


   








module.exports = userControllerRouter