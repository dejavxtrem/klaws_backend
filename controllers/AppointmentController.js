const express = require('express')
const mongoose = require("mongoose");
const appointment = require('../models/bookAppointment')

const appointmentRouter = express.Router()

//book a new appointment
appointmentRouter.post('/appointment', async (req, res) => {
    const { service, slot_time, slot_date, created_ByUserId, total, artistId } = req.body

    if (!service || !slot_time || !slot_date || !created_ByUserId || !total || !artistId) {
        return res.status(422).send({error: "Please provide booking information"})
    }
    try {
        const bookingDetails = new appointment({
            service,
            slot_time,
            slot_date,
            created_ByUserId: req.user._id,
            total,
            artistId,
        })
        await bookingDetails.save()
        if (bookingDetails) {
            return res.status(200).send({success: true, bookingDetails})
        }
    }
    catch (err) {
        res.status(400).send({error: err.message})
    }
})

//get all appointment for the specific user
appointmentRouter.get('/usersappointments', async (req, res) => {
    try {
        const useraAppointments = await appointment.find({created_ByUserId: req.user._id})
        if (useraAppointments) {
            return res.status(200).send({success: true, useraAppointments})
        }
    }
    catch (err) {
        res.status(400).send({error: err.message})
    }

})

//get all the appointments for an artist
appointmentRouter.get('/artistappointments', async (req, res) => {
    try {
        const artistappointments = await appointment.find({artistId: req.body.artistId})
        if (artistappointments) {
            return res.status(200).send({success: true, artistappointments})
        }
        if (!artistappointments) {
            return res.status(422).send({success: false, error: "artist does not exist"})
        }
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
})





module.exports = appointmentRouter