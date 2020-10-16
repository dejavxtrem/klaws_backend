const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/user/signup", (req, res, next) => {
  console.log(req.body);
  //console.log(req.body)
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (existingUser !== null) {
      res.status(400);
      return next(new Error("That username already exists!"));
    }
    const newUser = new User(req.body);
    newUser.save(() => {
      if (err) return res.status(500).send({ success: false, err });
      const token = jwt.sign(newUser.withoutPassword(), process.env.SECRET);
      return res.status(201).send({
        success: true,
        user: newUser.withoutPassword(),
        token,
      });
    });
  });
});

userRouter.post("/user/login", async (req, res) => {
  console.log(req.body);
  await User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
    const { password } = req.body;
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(403)
        .send({ success: false, err: "Email or password are incorrect" });
    }
    // user.comparePassword(password);
    // const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
    // return res.send({
    //   token: token,
    //   user: user.withoutPassword(),
    //   success: true,
    // });
    user.checkPassword(password, (err, match) => { 
      if (err) return res.status(500).send(err);
      if (!match) return res.status(401).send({ success: false, message: "Email  or password are incorrect" });
      const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
      return res.send({ token: token, user: user.withoutPassword(), success: true })
  })




  });
});

module.exports = userRouter;
