const express = require("express")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nailService = require('../models/addService')
const nailArtist = require("../models/NailTech"); 
const userGetArtistDataRouter = express.Router()


userGetArtistDataRouter.get('/artistnailService/:id', async (req, res) => {
    
    try {
    const artistServices = await nailService.find({artistId: req.params.id})

    if (artistServices) {
        return res.status(200).send({success: true, artistServices})
    }
    }
    catch (err) {
        return res.status(422).send({error: err.message})
    }
    
})

//get all artist data
userGetArtistDataRouter.get('/artist',  async (req, res) => {

    const artistProfile = await nailArtist.find((err, foundArtist) => {
       if (err) {
           return res.status(400).send({error: err.message})
       }
        return res.status(200).send({success: true, foundArtist})
       })
   

})



module.exports =  userGetArtistDataRouter;