const express = require('express')
const nailServiceRouter = express.Router()
const nailService = require('../models/addService')
const mongoose = require("mongoose");
const multer = require('multer')
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );



//storing image in amazon S3
const s3 = new aws.S3({
	accessKeyId: process.env.ACCESSKEYID,
	secretAccessKey: process.env.SECRETACCESSKEY,
	Bucket: process.env.ADDSERVICEBUCKET

});



const Storage = multerS3({
    s3:s3,
    bucket: process.env.ADDSERVICEBUCKET,
    acl: 'public-read',
    key:  function(req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
})


    const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
    }

    const upload = multer({
    storage: Storage,
    limits: {
        fileSize: { fileSize: 2000000 }
    },
    fileFilter: fileFilter

    })





// //multer image setup
// // const Storage = multer.diskStorage({
// //     destination: function(req, file, cb) {
// //         cb(null, 'uploads/postserviceimage');
// //       },
// //     filename(req, file, cb) {
// //         cb(null, Date.now() + file.originalname)
// //     },
// //   })

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }


// const upload = multer({
//     storage: Storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter

// })

//////////
 

//get all service info
nailServiceRouter.get('/nailService', async (req, res) => {
    const  postService = await nailService.find({artistId: req.user._id})
    res.send(postService)
})


//get a particular service 
nailServiceRouter.get('/nailService/:id', async (req, res) => {
        id = req.params.id
        if (!id) {
            res.status(400).json({message: "no service type found"})
        }

        try {
            const service = await nailService.findById(id)
            res.status(200).json(service)
        } catch (err) {
            res.status(500).send({error: err.message})
        }
})


//post new service
nailServiceRouter.post('/nailService', upload.array("servicePhoto", 5 ), async (req, res, next) => {
    console.log(req.files)
    //console.log(req.body)
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
        newArray.push(pathName.location)
    })

    try {
        const serviceDetails = new nailService ({
            serviceType : req.body.serviceType,
            serviceName: req.body.serviceName,
            address: req.body.address,
            servicePrice: req.body.servicePrice,
            serviceTime: req.body.serviceTime,
            artistId: req.user._id,
            servicePhoto: newArray
        })
        await serviceDetails.save()
        res.status(200).send(serviceDetails)
    } catch (err) {
        res.send({error: err.message})
    }

})



//update a service





//delete a service
nailServiceRouter.delete('/nailService/:id', async (req, res) => {
    if (artistId === req.user._id) {
        await  nailService.findByIdAndRemove(req.params.id, (err, foundService) => {
            if (err) {
                res.status(400).send({error: err.message})
            }
                res.status(200).send(foundService)
        })
    }
})






module.exports = nailServiceRouter
