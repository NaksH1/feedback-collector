const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const Volunteer = model.Volunteer;
const Feedback = model.Feedback;
const authenticateJwt = require('../middlewares/authentication.js');

router.post('/', authenticateJwt, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id, published: true, volunteers: [] });
    if (event.name === 'Bhava Spandana')
      event.image = "https://static.sadhguru.org/d/46272/1650519638-website-thumbnail-yogameditation-bsp.jpg";
    else if (event.name === 'Shoonya Intensive')
      event.image = "https://static.sadhguru.org/d/46272/1650449300-website-thumbnail-yogameditation-shoonya.jpg";
    else if (event.name === 'Inner Engineering Retreat')
      event.image = "https://innerengineering.sadhguru.org/_next/static/media/IEO_social-share1200x630_ier.f4a2c643.jpg";
    else
      event.image = "https://yt3.googleusercontent.com/DIw1OAZ5O-jdlTYbKTQcSfD9oiOruOOBilP4YqefzIs0-ZVrEDwD6izMmmze5CMGYYycb6Qdyg=s900-c-k-c0x00ffffff-no-rj";
    await event.save();
    res.status(201).json({ message: "Event added", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
});

router.get('/', authenticateJwt, async (req, res) => {
  const events = await Event.find({});
  res.json({ events: events });
});

router.get('/:eventId', authenticateJwt, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (event)
    res.status(200).json({ event: event });
  else
    res.status(404).json({ message: "Event not found" });
})

router.put('/:eventId', authenticateJwt, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
  if (event) {
    if (event.name === 'Bhava Spandana')
      event.image = "https://static.sadhguru.org/d/46272/1650519638-website-thumbnail-yogameditation-bsp.jpg";
    else if (event.name === 'Shoonya Intensive')
      event.image = "https://static.sadhguru.org/d/46272/1650449300-website-thumbnail-yogameditation-shoonya.jpg";
    else if (event.name === 'Inner Engineering Retreat')
      event.image = "https://innerengineering.sadhguru.org/_next/static/media/IEO_social-share1200x630_ier.f4a2c643.jpg";
    else
      event.image = "https://yt3.googleusercontent.com/DIw1OAZ5O-jdlTYbKTQcSfD9oiOruOOBilP4YqefzIs0-ZVrEDwD6izMmmze5CMGYYycb6Qdyg=s900-c-k-c0x00ffffff-no-rj";
    await event.save();
    res.status(200).json({ message: "Event information updated", event });
  }
  else
    res.status(404).json({ message: "Event not found" });
});

router.post('/addVolunteer', authenticateJwt, async (req, res) => {
  const { name, mobileNumber, type, eventId } = req.body;
  let volunteer = await Volunteer.findOne({ mobileNumber: mobileNumber });
  if (!volunteer) {
    volunteer = new Volunteer({ name: name, mobileNumber: mobileNumber, type: type, createdBy: req.user.id, feedbacks: [] });
    if (type === 'potential') {
      const feedback = new Feedback({ eventId: eventId, volunteerId: volunteer._id, remark: req.body.remark, givenBy: req.user.id });
      await feedback.save();
      volunteer.feedbacks.push(feedback.id);
    }
    await volunteer.save();
  }
  const event = await Event.findById({ _id: eventId });
  event.volunteers.push(volunteer._id);
  await event.save();
  res.status(201).json({ message: "Volunteer added to event", volunteer });
});

router.get('/getVolunteer/:eventId', authenticateJwt, async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId).populate({
    path: 'volunteers',
    populate: { path: 'createdBy', select: 'name' }
  });
  if (event) {
    res.json({ volunteers: event.volunteers })
  }
  else {
    res.status(404).json({ message: "Event not found" });
  }
});

module.exports = router;
