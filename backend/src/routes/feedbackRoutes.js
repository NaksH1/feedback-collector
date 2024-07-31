const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const Volunteer = model.Volunteer;
const Feedback = model.Feedback;
const authenticateJwt = require('../middlewares/authentication');

router.post('/', authenticateJwt, async (req, res) => {
  const { volunteerId, eventId } = req.body;
  const volunteer = await Volunteer.findById({ _id: volunteerId });
  const event = await Event.findById({ _id: eventId });
  if (volunteer && event) {
    const feedback = new Feedback({ ...req.body, givenBy: req.user.id });
    await feedback.save();
    res.status(201).json({ message: "Feedback recorded", feedback });
    volunteer.feedbacks.push(feedback);
    await volunteer.save();
  }
  else {
    res.status(404).json({ message: "Error in the details provided" });
  }
});

router.get('/:volunteerId', authenticateJwt, async (req, res) => {
  const volunteer = await Volunteer.findById({ _id: req.params.volunteerId }).populate('feedbacks');
  const feedbacks = await Promise.all(volunteer.feedbacks.map(async (feedback) => {
    const event = await Event.findById({ _id: feedback.eventId });
    const eventName = event.name;
    const eventDate = event.date;
    return {
      ...feedback.toObject(),
      eventName: eventName,
      eventDate: eventDate
    }
  }));
  if (volunteer) {
    res.json({ feedbacks: feedbacks || [] });
  }
  else
    res.status(404).json({ message: "Volunteer not found" });
});

module.exports = router;
