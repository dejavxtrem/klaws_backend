const express = require("express");
const mongoose = require("mongoose");
const nailArtist = require("../models/NailTech");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );

const nailTechRouter = express.Router();


//storing image in amazon S3
const s3 = new aws.S3({
	accessKeyId: process.env.ACCESSKEYID,
	secretAccessKey: process.env.SECRETACCESSKEY,
	Bucket: process.env.BUCKET
});





// const Storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'uploads/nailartistavatar');
//     },
//   filename(req, file, cb) {
//       cb(null, Date.now() + file.originalname)
//   },
// })


const Storage = multerS3({
      s3:s3,
      bucket: process.env.BUCKET,
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


nailTechRouter.post("/nailtech/signup",  upload.single('avatar'), (req, res) => {
  //console.log('body', req.body)
  //console.log('file', req.file)


  nailArtist.findOne({ email: req.body.email }, async (err, existingTech) => {
  
      try {

        if (existingTech !== null) {
          res.status(400);
          throw  new Error("That email already exists!");
        }
        
        const { availabletimes } = req.body
        let timeSlots = []
        timeSlots.push(...availabletimes)
  
        //console.log(timeSlots)

        const newArtist =  new nailArtist({
          //avatar: req.file.location,
          name: req.body.name,
          type: req.body.type,
          email: req.body.email,
          password: req.body.password,
          salonname: req.body.salonname,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          zipcode: req.body.zipcode,
          openinghour: req.body.openinghour,
          closinghour: req.body.closinghour,
          artistLat: req.body.artistLat,
          artistLong: req.body.artistLong,
          accuracy: req.body.accuracy,    
          availabletimes: timeSlots
        });
  
        await newArtist.save()
       // console.log(newArtist)
        const token = jwt.sign(newArtist.withoutPassword(), process.env.SECRET);
        return res.status(201).send({
          success: true,
          nailTech: newArtist.withoutPassword(),
          token,
        });

      } catch (err) {
        console.log(err)
        if (err) return res.status(500).send({ success: false, err: err.message });
      }
    });
   

 
});

nailTechRouter.post("/nailtech/login",  async (req, res, next) => {

  try {
    console.log(req.body);
    await nailArtist.findOne(
      { email: req.body.email.toLowerCase() },
   ( err, nailTech)  => {
        const { password } = req.body;
      if (err) {
        return res.status(500).send({err: err.message})
      }

     if (!nailTech)  {
      return res.status(403).send({sucess: false, err: "email or password is incorrect"})
     }

    nailTech.checkPassword(password, (err, match) => { 
        if (err) return res.status(500).send(err);
        if (!match) return res.status(401).send({ success: false, message: "Email  or password are incorrect" });
        const token = jwt.sign(nailTech.withoutPassword(), process.env.SECRET);
        return res.send({ token: token, nailTech: nailTech.withoutPassword(), success: true })
    });

    // nailTech.comparePassword(password);
    // const token = jwt.sign(nailTech.withoutPassword(), process.env.SECRET);
    // return res.send({
    //   token: token,
    //   nailTech: nailTech.withoutPassword(),
    //   success: true,
    // });
      }
    )
  } catch (err) {
    console.log(err)
    next(err)
  }
});











nailTechRouter.get("/artist", (req, res) => {
  nailArtist.find((err, artist) => {
    console.log(artist);
    if (err) {
      return next(err);
    }
    if (!artist) {
      return res
        .status(403)
        .send({ success: false, err: "there is no any artist registered" });
    }
    return res.send({ success: true, artist});
  });
});










module.exports = nailTechRouter;

