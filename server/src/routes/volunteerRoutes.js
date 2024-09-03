const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Volunteer = model.Volunteer;
const authenticateJwt = require('../middlewares/authentication').authenticateJwt;

router.post('/', authenticateJwt, async (req, res) => {
  const mobileNumber = req.body.mobileNumber;
  const exist = await Volunteer.findOne({ mobileNumber });
  if (exist) {
    res.status(403).json({ message: "Volunteer already exists" });
  }
  else {
    const newVolunteer = new Volunteer({ ...req.body, createdBy: req.user.id, feedbacks: [] });
    await newVolunteer.save();
    res.status(200).json({ message: "Volunteer created" });
  }
});

router.get('/getList', async (req, res) => {
  const volunteers = await Volunteer.find({}).populate('feedbacks');
  const training = [];
  const potential = [];
  const programVolunteer = [];
  const volunteerList = [];
  for (const volunteer of volunteers) {
    let existT = false;
    let existPV = false;
    let existP = false;
    volunteer.feedbacks.forEach(feedback => {
      if (feedback.type === 'training' && !existT) {
        training.push(volunteer);
        existT = true;
      } else if (feedback.type === 'programVolunteer' && !existPV) {
        programVolunteer.push(volunteer);
        existPV = true;
      } else if (feedback.type === 'potential' && !existP) {
        potential.push(volunteer);
        existP = true;
      }
    });
    const feedback = volunteer.feedbacks[volunteer.feedbacks.length - 1];
    let singleVolunteer = {
      id: volunteer._id,
      name: volunteer.name,
      mobileNumber: volunteer.mobileNumber,
      gender: volunteer.gender,
      city: volunteer.city,
    }
    if (feedback) {
      singleVolunteer.category = feedback.type === 'training' ? 'Training' : feedback.type === 'potential' ? 'Potential' : 'PV Under Obs.';
      for (let i = volunteer.feedbacks.length - 1; i >= 0; i--) {
        const feedbackI = volunteer.feedbacks[i];
        if (feedbackI[feedbackI.type].status !== undefined) {
          singleVolunteer.status = feedbackI[feedbackI.type].status;
          break;
        }
      }
      if (singleVolunteer.status === undefined)
        singleVolunteer.status = 'Not Given';
    }
    else {
      singleVolunteer.category = 'No Feedbacks';
      singleVolunteer.status = 'No Feedbacks';
    }
    volunteerList.push(singleVolunteer);
  }
  res.json({ training: training, programVolunteer: programVolunteer, potential: potential, volunteers: volunteerList });
})

router.get('/volunteerfulldetails/:volunteerId', authenticateJwt, async (req, res) => {
  const volunteerId = req.params.volunteerId;
  const volunteer = await Volunteer.findById(volunteerId).populate({
    path: 'feedbacks',
    match: { deletedAt: { $eq: null } },
    populate: [
      { path: 'eventId', select: 'name date' },
      { path: 'givenBy', select: 'name' },
      { path: 'training.questionnaire' },
      { path: 'programVolunteer.questionnaire' }
    ]
  }).exec();
  const programCounter = {};
  if (!volunteer)
    res.status(404).json({ message: 'Volunteer not found' });
  for (const feedback of volunteer.feedbacks) {
    const eventName = feedback.eventId.name;
    if (programCounter.hasOwnProperty(eventName))
      programCounter[eventName] += 1;
    else
      programCounter[eventName] = 1;
  }
  const totalProgram = volunteer.feedbacks.length;
  res.status(200).json({ volunteer: volunteer, programCounter: programCounter, totalProgram: totalProgram });
})

router.put('/:volunteerId', authenticateJwt, async (req, res) => {
  const volunteer = Volunteer.findByIdAndUpdate(req.params.volunteerId, req.body, { new: true });
  if (volunteer)
    res.status(200).json({ message: "Updated", volunteer });
  else
    res.status(404).json({ message: "Not found" });
});

router.get('/', async (req, res) => {
  const volunteers = await Volunteer.find({}).populate('createdBy', 'name');
  res.json({ volunteers: volunteers });
});

router.get('/:volunteerId', authenticateJwt, async (req, res) => {
  const { id } = req.params.volunteerId;
  const volunteer = await Volunteer.findById({ id });
  if (volunteer)
    res.status(200).json({ volunteer });
  else
    res.status(404).json({ message: "Volunteer not found" });
});

router.delete('/:volunteerId', authenticateJwt, async (req, res) => {
  const volunteer = await Volunteer.findOneAndDelete({ id: req.params.volunteerId });
  if (volunteer)
    res.status(200).json({ message: "Volunteer deleted", volunteer });
  else
    res.status(404).json({ message: "Volunteer not found" });
});

module.exports = router;
