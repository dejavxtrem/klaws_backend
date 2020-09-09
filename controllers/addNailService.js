const express = require('express')
const nailService = require('../models/addService')
const mongoose = require("mongoose");
const multer = require('multer')

const nailServiceRouter = express.Router()


//multer image setup
const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/postserviceimage');
      },
    filename(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    },
  })

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

})

//////////
 


nailServiceRouter.get('/nailService', async (req, res) => {
    console.log(req.body)
    const id = "5f5616c23644190d20dbec7e"
    const  postService = await nailService.find({artistId: req.nailArtist._id})
    res.send(postService)
})



// nailServiceRouter.get('/nailService/:id', async (req, res) => {
//         id = req.params.id
//         if (!id) {
//             res.status(400).json({message: "no service type found"})
//         }

//         try {
//             const service = await nailService.find({artistId: req.artistId})
//             res.status(200).json(service)
//         } catch (err) {
//             res.status(500).send({error: err.message})
//         }
// })


nailServiceRouter.post('/nailService', upload.array("servicePhoto", 5 ), async (req, res, next) => {
     console.log('body', req.files) 

    nailService.findOne({serviceName: req.body.serviceName}, (err, serviceFound) => {
        if (err) {
                 return res.status(500)             
             }
        if(serviceFound !== null) {
                 res.status(400).send("service already exist")
             }
         })
         
    const filePath = req.files
    const newArray = []
    filePath.forEach((pathName) => {
        newArray.push(pathName.path)
    })

    try {
        const serviceDetails = new nailService ({
            serviceType : req.body.serviceType,
            serviceName: req.body.serviceName,
            address: req.body.address,
            servicePrice: req.body.servicePrice,
            serviceTime: req.body.serviceTime,
            artistId: req.nailArtist._id,
            servicePhoto: newArray
        })
        await serviceDetails.save()
        res.status(200).send(serviceDetails)
    } catch (err) {
        res.send({error: err.message})
    }

})

module.exports = nailServiceRouter
