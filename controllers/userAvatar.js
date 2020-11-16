const express = require("express")
const userAvatarRouter = express.Router()
const userImage = require('../models/userImage')
const mongoose = require("mongoose");
const multer = require('multer')
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );

// const Storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//       },
//     filename(req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     },
//   })


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

const s3 = new aws.S3({
	accessKeyId: process.env.ACCESSKEYID,
	secretAccessKey: process.env.SECRETACCESSKEY,
	Bucket: process.env.USERAVATABUCKET

});

const Storage = multerS3({
    s3:s3,
    bucket: process.env.USERAVATABUCKET,
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
        fileSize: { fileSize: 5000000 }
    },
    fileFilter: fileFilter
  
  })

userAvatarRouter.get('/upload/:id', async (req, res) =>{
    id = req.params.id
    if (!id) {
        res.status(400).json({message: "no valid profile for that id"})
    }
     try {
        const  userProfile = await userImage.find({userId: req.user._id})
        return res.status(200).send({success: true, userProfile})
     } catch (err) {
            res.status(500).json({error: err.message})
     }
    
})





userAvatarRouter.post('/upload', upload.single('userImage'), async (req, res) => {
    console.log('file', req.file)
        console.log('body', req.body)
//     res.status(200).json({
//     message: 'success!',
//   })
     const  {userId} = req.body
     if (!userId) {
         return res.status(422).send({error: "please provide image avatar"})
     } 
     try {
         const userProfile = new userImage ({
            userId: req.user._id,
            userImage: req.file.location
         })
         await userProfile.save()
         return res.status(200).send({success:true, userProfile})
     } catch (err) {
         res.status(500).json({ error: err.message})
     }
}) 




module.exports = userAvatarRouter