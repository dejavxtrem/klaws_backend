const express = require("express");
const mongoose = require("mongoose");
const nailArtist = require("../models/NailTech");
const jwt = require("jsonwebtoken");

const nailTechRouter = express.Router();

nailTechRouter.post("/nailtech/signup", (req, res, next) => {
  nailArtist.findOne({ email: req.body.email }, (err, existingTech) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (existingTech !== null) {
      res.status(400);
      return next(new Error("That email already exists!"));
    }

    const newArtist = new nailArtist(req.body);
    newArtist.save(() => {
      if (err) return res.status(500).send({ success: false, err });
      const token = jwt.sign(newArtist.withoutPassword(), process.env.SECRET);
      return res.status(201).send({
        success: true,
        nailTech: newArtist.withoutPassword(),
        token,
      });
    });
  });
});

nailTechRouter.post("/nailtech/login", (req, res) => {
  console.log(req.body);
  nailArtist.findOne(
    { email: req.body.email.toLowerCase() },
    (err, nailTech) => {
      const { password } = req.body;
      if (err) {
        return next(err);
      }
      if (!nailTech) {
        return res
          .status(403)
          .send({ success: false, err: "Username or password are incorrect" });
      }
      nailTech.comparePassword(password);
      const token = jwt.sign(nailTech.withoutPassword(), process.env.SECRET);
      return res.send({
        token: token,
        nailTech: nailTech.withoutPassword(),
        success: true,
      });
    }
  );
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

    return res.send({ success: true, artist });
  });
});

module.exports = nailTechRouter;
