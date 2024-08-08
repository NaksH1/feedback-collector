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

router.get('/full/:feedbackId', authenticateJwt, async (req, res) => {
  const feedback = await Feedback.findById(req.params.feedbackId).populate([
    { path: 'eventId', select: 'name date' },
    { path: 'givenBy', select: 'name' }
  ]).exec();
  if (feedback)
    res.status(200).json({ feedback: feedback });
  else
    res.json(404).json({ message: "feedback not found" });
})
router.get('/:volunteerId', authenticateJwt, async (req, res) => {
  const volunteer = await Volunteer.findById({ _id: req.params.volunteerId }).populate({
    path: 'feedbacks',
    match: { deleted_at: { $eq: null } },
    populate: [
      { path: 'eventId', select: 'name date' },
      { path: 'givenBy', select: 'name' }
    ]
  }).exec();
  if (volunteer) {
    res.json({ feedbacks: volunteer.feedbacks || [] });
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

router.delete('/:feedbackId', authenticateJwt, async (req, res) => {
  const feedbackId = req.params.feedbackId;
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback)
    res.status(404).json({ message: 'Feedback not found' });
  else {
    await feedback.softDelete();
    res.status(200).json({ message: 'Feedback deleted', feedback: feedback });
  }
})

router.put('/recover/:feedbackId', authenticateJwt, async (req, res) => {
  const feedbackId = req.params.feedbackId;
  const feedback = await Feedback.findById(feedbackId);
  await feedback.restore();
  res.status(200).json({ message: "Feedback recovered", feedback: feedback });

})
module.exports = router;

