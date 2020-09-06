const express = require('express')
const nailService = require('../models/addService')
const mongoose = require("mongoose");
const multer = require('multer')

const nailServiceRouter = express.Router()




nailServiceRouter.get('/nailService', async (req, res) => {
    const  postService = await nailService.find({artistId: req.artistId._id})
    res.send(postService)
})


nailServiceRouter.post('/nailService', async (req, res) => {
    console.log('body', req.body) 
    const {serviceBody} = req.body

    if (!serviceBody) {
        res.status(422).send({error: "No service posted"})
    }
    
    try {
        const serviceBody = new nailService({
            serviceType : req.serviceType,
            service: req.service,
            artistId: req.artistId._id
        })
        await serviceBody.save()
        res.status(200).json(serviceBody)
    } catch (err) {
        res.status(500).json({error: err.message})
    }

})
