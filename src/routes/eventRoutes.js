const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const authenticateJwt = require('../middlewares/authentication.js');

router.post('/', authenticateJwt, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id, published: true });
    await event.save();
    res.status(201).json({ message: "Event added", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
});

router.get('/', authenticateJwt, async (req, res) => {
  const events = await Event.find({});
  res.json({ events });
});

router.put('/:eventId', authenticateJwt, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
  if (event) {
    res.status(200).json({ message: "Event information updated", event });
  }
  else
    res.status(404).json({ message: "Event not found" });
});

module.exports = router;
