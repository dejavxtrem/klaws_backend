const express = require("express")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nailService = require('../models/addService')
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

module.exports =  userGetArtistDataRouter;