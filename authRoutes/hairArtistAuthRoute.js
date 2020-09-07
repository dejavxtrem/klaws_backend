const express = require('express')
const mongoose = require('mongoose')
const hairArtist = require('../models/HairTech')
const jwt = require('jsonwebtoken')

const hairArtistRouter = express.Router()

hairArtistRouter.post('/hairtech/signup', (req, res, next) => {

    hairArtist.findOne({email: req.body.email.toLowerCase()},(err, existingTech) => {
        if (err) {
            res.status(500)
            return next(err)
        }  
        if (existingTech !== null) {
            res.status(400)
            return next(new Error('That email already exists!'))
        }

        const newArtist = new hairArtist(req.body)
        newArtist.save(() => {
        if (err) return  res.status(500).send({success: false, err})
        const token = jwt.sign(newArtist.withoutPassword(), process.env.SECRET)
        return res.status(201).send({
            success: true,
            hairTech: newArtist.withoutPassword(),
            token
        })
    })
})

})




hairArtistRouter.post('/hairtech/login', ( req, res) => {
    console.log(req.body)
    hairArtist.findOne({email: req.body.email.toLowerCase()}, (err, hairTech) => {
        const  { password } = req.body
         if (err) {
             return next(err)
         }
         if (!hairTech) {
             return res.status(403).send({success: false, err: "Username or password are incorrect"})
         }
         hairTech.comparePassword(password)
         const token = jwt.sign(hairTech.withoutPassword(), process.env.SECRET)
         return res.send({token: token, hairTech: hairTech.withoutPassword(), success: true})
 })

})

module.exports = hairArtistRouter