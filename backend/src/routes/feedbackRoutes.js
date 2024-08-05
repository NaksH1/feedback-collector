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
  // const volunteer1 = await Volunteer.findById(req.params.volunteerId).populate({
  //   path: 'feedbacks',
  //   populate: [
  //     { path: 'eventId', select: 'name' },
  //     { path: 'givenBy', select: 'name' }
  //   ]
  // });
  // console.log(volunteer1.eventId, volunteer1.givenBy);
  if (volunteer) {
    res.json({ feedbacks: feedbacks || [] });
  }
  else
    res.status(404).json({ message: "Volunteer not found" });
});

router.get('/view/:feedbackId', authenticateJwt, async (req, res) => {
  const feedback = await Feedback.findById(req.params.feedbackId).populate([
    { path: 'eventId' },
    { path: 'volunteerId', select: 'name' },
    { path: 'givenBy', select: 'name' }
  ]);
  if (feedback) {
    res.json({ feedback: feedback });
  }
  else
    res.status(404).json({ message: "Feedback not found" });
})

router.put('/:feedbackId', authenticateJwt, async (req, res) => {
  const feedbackId = req.params.feedbackId;
  const feedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, { new: true });
  if (feedback)
    res.json({ message: "Feedback updated", feedback: feedback });
  else
    res.json({ message: "Feedback not found" });
})


module.exports = router;

