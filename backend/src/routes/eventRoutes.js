const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const Volunteer = model.Volunteer;
const Feedback = model.Feedback;
const authenticateJwt = require('../middlewares/authentication.js');

const eventList = {
  'Bhava Spandana': 'https://static.sadhguru.org/d/46272/1650519638-website-thumbnail-yogameditation-bsp.jpg',
  'Shoonya Intensive': 'https://static.sadhguru.org/d/46272/1650449300-website-thumbnail-yogameditation-shoonya.jpg',
  'Inner Engineering Retreat': 'https://innerengineering.sadhguru.org/_next/static/media/IEO_social-share1200x630_ier.f4a2c643.jpg',
  'Samyama': 'https://static.sadhguru.org/d/46272/1650517087-website-thumbnail-yogameditation-samyama.jpg',
  'Samyama Sadhana': 'https://static.sadhguru.org/d/46272/1650454519-website-thumbnail-yogameditation-samyama-sadhana.jpg',
  'Guru Pooja': 'https://static.sadhguru.org/d/46272/1650453435-website-thumbnail-yogameditation-gurupooja.jpg',
  'HINAR': 'https://static.sadhguru.org/d/46272/1633207053-1633207051299.jpg',
  'Insight': 'https://static.sadhguru.org/d/46272/1633491123-1633491122604.jpg',
  'IAS Retreat': 'https://static.sadhguru.org/d/46272/1633198144-1633198143291.jpg',
  'Lap of Master': 'https://static.sadhguru.org/d/46272/1651468994-isha_sadhguru_events_lapofmaster-thumbnail.jpg',
  'Guru Purnima': 'https://static.sadhguru.org/d/46272/1652129109-guru-purnima-2019-14.jpg',
  'Mahashivratri': 'https://static.sadhguru.org/d/46272/1633495270-1633495268886.jpg',
  'Yantra Ceremony': 'https://static.sadhguru.org/d/46272/1641975872-yantra_module2.jpg',
  'Other': 'https://static.sadhguru.org/d/46272/1650526600-website-thumbnail-yogameditation-training-landing.jpg'
}

router.get('/eventlist', authenticateJwt, async (req, res) => {
  const eventListKeys = Object.keys(eventList);
  if (eventListKeys)
    res.status(200).json({ eventList: eventListKeys });
  else
    res.status(404).json({ message: 'Event list not found' })
})

router.post('/', authenticateJwt, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id, published: true, volunteers: [] });
    if (eventList.hasOwnProperty(event.name))
      event.image = eventList[event.name];
    else
      event.image = eventList['Other'];
    await event.save();
    res.status(201).json({ message: "Event added", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
});

router.get('/', authenticateJwt, async (req, res) => {
  const events = await Event.find({}).populate({ path: 'programCoordinator', select: 'name' });
  res.json({ events: events });
});

router.get('/:eventId', authenticateJwt, async (req, res) => {
  const event = await Event.findById(req.params.eventId).populate({ path: 'programCoordinator', select: 'name' });
  if (event)
    res.status(200).json({ event: event });
  else
    res.status(404).json({ message: "Event not found" });
})

router.put('/:eventId', authenticateJwt, async (req, res) => {
  req.body.programCoordinator = req.body.programCoordinator.id;
  const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
  if (event) {
    if (eventList.hasOwnProperty(event.name))
      event.image = eventList[event.name];
    else
      event.image = eventList['Other'];
    await event.save();
    res.status(200).json({ message: "Event information updated", event });
  }
  else
    res.status(404).json({ message: "Event not found" });
});

router.post('/addVolunteer', authenticateJwt, async (req, res) => {
  const { name, mobileNumber, type, eventId, gender, city } = req.body;
  let volunteer = await Volunteer.findOne({ mobileNumber: mobileNumber });
  if (!volunteer) {
    volunteer = new Volunteer({
      name: name, mobileNumber: mobileNumber, createdBy: req.user.id,
      gender: gender, city: city, feedbacks: []
    });
    await volunteer.save();
  }
  const event = await Event.findById(eventId);
  const exist = event.volunteers.find(v => (v.volunteerId.equals(volunteer._id)));
  if (exist) {
    res.status(409).json({ message: "Volunteer already present" });
  }
  else {
    if (type === 'potential') {
      const potentialFeedback = { remarks: req.body.remarks };
      const feedback = new Feedback({ eventId: eventId, volunteerId: volunteer._id, type: type, potential: potentialFeedback, givenBy: req.user.id });
      await feedback.save();
      volunteer.feedbacks.push(feedback.id);
      await volunteer.save();
    }
    event.volunteers.push({ volunteerId: volunteer._id, type: type });
    await event.save();
    res.status(201).json({ message: "Volunteer added to event", volunteer });
  }
});

router.get('/getVolunteer/:eventId', authenticateJwt, async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId).populate({
    path: 'volunteers.volunteerId',
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
