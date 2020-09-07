const express = require('express')
const mongoose = require('mongoose')
const lashArtist = require('../models/LashTech')
const jwt = require('jsonwebtoken')

const lashArtistRouter = express.Router()

lashArtistRouter.post('/lashtech/signup', (req, res, next) => {

    lashArtist.findOne({email: req.body.email.toLowerCase()},(err, existingTech) => {
        if (err) {
            res.status(500)
            return next(err)
        }  
        if (existingTech !== null) {
            res.status(400)
            return next(new Error('That email already exists!'))
        }

        const newArtist = new lashArtist(req.body)
        newArtist.save(() => {
        if (err) return  res.status(500).send({success: false, err})
        const token = jwt.sign(newArtist.withoutPassword(), process.env.SECRET)
        return res.status(201).send({
            success: true,
            lashTech: newArtist.withoutPassword(),
            token
        })
    })
})

})




lashArtistRouter.post('/nailtech/login', ( req, res) => {
    console.log(req.body)
    lashArtist.findOne({email: req.body.email.toLowerCase()}, (err, lashTech) => {
        const  { password } = req.body
         if (err) {
             return next(err)
         }
         if (!lashTech) {
             return res.status(403).send({success: false, err: "Username or password are incorrect"})
         }
         lashTech.comparePassword(password)
         const token = jwt.sign(lashTech.withoutPassword(), process.env.SECRET)
         return res.send({token: token, lashTech: lashTech.withoutPassword(), success: true})
 })

})

module.exports = lashArtistRouter