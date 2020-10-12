const express = require("express");
const mongoose = require("mongoose");
const nailArtist = require("../models/NailTech");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

 const artistProfileRouter = express.Router()
 



//update password controller
 artistProfileRouter.patch('/:id', async (req, res) => {
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

    await nailArtist.updateOne ({_id: req.params.id}, {$set: req.body})
    .then((nailTech) => res.status(200).send({success: true, nailTech, }))
    .catch((err) => res.status(400).send({sucess: false, err: err.message}))
    })
  })



   
  })



  module.exports = artistProfileRouter