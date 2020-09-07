const express = require('express')
const mongoose = require('mongoose')
const makeUpArtist = require('../models/MakeupArtist')
const jwt = require('jsonwebtoken')

const makeUpArtistRouter = express.Router()

makeUpArtistRouter.post('/makeuptech/signup', (req, res, next) => {

    makeUpArtist.findOne({email: req.body.email.toLowerCase()},(err, existingTech) => {
        if (err) {
            res.status(500)
            return next(err)
        }  
        if (existingTech !== null) {
            res.status(400)
            return next(new Error('That user already exists!'))
        }

        const newArtist = new nailArtist(req.body)
        newArtist.save(() => {
        if (err) return  res.status(500).send({success: false, err})
        const token = jwt.sign(newArtist.withoutPassword(), process.env.SECRET)
        return res.status(201).send({
            success: true,
            makeUpTech: newArtist.withoutPassword(),
            token
        })
    })
})

})




makeUpArtistRouter.post('/makeuptech/login', ( req, res) => {
    console.log(req.body)
    makeUpArtist.findOne({email: req.body.email.toLowerCase()}, (err, hairTech) => {
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

module.exports = makeUpArtistRouter