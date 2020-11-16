const express = require("express");
const mongoose = require("mongoose");
const nailArtist = require("../models/NailTech");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

 const artistProfileRouter = express.Router()
 



//update artist password controller
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
    .catch((err) => res.status(400).send({success: false, err: err.message}))
    })
  })
   
  })


  //update artist profile
  artistProfileRouter.put('/:id', async ( req, res) => {
    const id = req.params.id
    await nailArtist.findByIdAndUpdate(id, req.body, {new: true}, (err, artistData) => {
        if (err) {
          return res.status(400).send({error: err.message})
        }
        return res.status(200).send({success: true, artistData})
    }).catch((err) => res.status(404).send({success: false, error: err.message}))
  })




  

  module.exports = artistProfileRouter