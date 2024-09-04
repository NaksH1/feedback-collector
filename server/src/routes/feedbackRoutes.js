const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const Volunteer = model.Volunteer;
const Feedback = model.Feedback;
const Questionnaire = model.Questionnaire;
const authenticateJwt = require('../middlewares/authentication').authenticateJwt;
const { predefinedTrainingQuestions, predefinedProgramVolunteerQuestions, trainingQuestionsId, programVolunteerQuestionsId } = require('../model/initQuestions');

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

router.get('/view/:feedbackId', authenticateJwt, async (req, res) => {
  const feedback = await Feedback.findById(req.params.feedbackId).populate([
    { path: 'eventId' },
    { path: 'volunteerId', select: 'name' },
    { path: 'givenBy', select: 'name' },
    { path: 'programVolunteer.questionnaire' },
    { path: 'training.questionnaire' }
  ]);
  if (!feedback)
    res.status(404).json({ message: "Feedback not found" });
  if (feedback.type === 'training' || feedback.type === 'programVolunteer') {
    let feedbackState = {};
    for (const question of feedback[feedback.type].questionnaire) {
      feedbackState[question._id] = feedbackState[question._id] || {};
      if (question.options && question.options.length) {
        feedbackState[question._id].selectedOptions = [];
        for (const option of question.options) {
          if (option.selected) {
            feedbackState[question._id].selectedOptions.push(option.name);
          }
        }
      }
      if (question.answer)
        feedbackState[question._id].answer = question.answer;
    }
    return res.json({ feedback: feedback, feedbackState: feedbackState });
  }
  return res.json({ feedback: feedback })
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
  const eventId = req.body.eventId;
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback)
    res.status(404).json({ message: 'Feedback not found' });
  else {
    const event = await Event.findById(eventId);
    const volunteer = await Volunteer.findById(feedback.volunteerId);
    event.volunteers = event.volunteers.filter(volunteer => String(volunteer.volunteerId) !== String(feedback.volunteerId));
    volunteer.feedbacks = volunteer.feedbacks.filter(feedback => String(feedback) !== String(feedback._id));
    await event.save();
    await volunteer.save();
    await feedback.softDelete();
    res.status(200).json({ message: 'Feedback deleted', feedback: feedback });
  }
})

router.put('/recover/:feedbackId', authenticateJwt, async (req, res) => {
  const feedbackId = req.params.feedbackId;
  const eventId = req.body.eventId;
  const feedback = await Feedback.findById(feedbackId);
  await feedback.restore();
  const event = await Event.findById(eventId);
  const volunteer = await Volunteer.findById(feedback.volunteerId);
  event.volunteers.push({
    volunteerId: volunteer._id,
    type: feedback.type
  });
  volunteer.feedbacks.push(feedbackId);
  await event.save();
  await volunteer.save();
  res.status(200).json({ message: "Feedback recovered", feedback: feedback });

})

const createClonedFeedback = async (feedbackData) => {
  try {
    const { type, volunteerId, eventId } = feedbackData;
    let originalQuestions;
    if (type === 'training')
      originalQuestions = await Questionnaire.find({ _id: { $in: trainingQuestionsId } });
    else if (type === 'programVolunteer')
      originalQuestions = await Questionnaire.find({ _id: { $in: programVolunteerQuestionsId } });
    else
      throw new Error('Feedback type not found');

    // const idMapping = {};
    const clonedQuestions = await Promise.all(originalQuestions.map(async (question) => {
      const clonedQuestion = question.toObject();
      // const originalId = clonedQuestion._id.toString();
      delete clonedQuestion._id;
      const newQuestion = await Questionnaire.create(clonedQuestion);
      // idMapping[originalId] = newQuestion._id.toString();
      return newQuestion;
    }));
    const newFeedback = new Feedback({
      eventId, volunteerId, type,
      [type]: { questionnaire: clonedQuestions.map(q => q._id) }
    });

    await newFeedback.save();
    return newFeedback;
  }
  catch (error) {
    throw new Error('Failed to create feedback with cloned questions: ' + error.message);
  }
}

router.get('/questions/:type', authenticateJwt, async (req, res) => {
  const type = req.params.type;
  const { volunteerId, eventId } = req.query;
  const feedback = await Feedback.findOne({ eventId: eventId, volunteerId: volunteerId });
  if (!feedback) {
    try {
      const newFeedback = await createClonedFeedback({ type, volunteerId, eventId });
      await newFeedback.populate({ path: `${type}.questionnaire` });
      if (newFeedback) {
        res.status(200).json({ questionnaire: newFeedback[type].questionnaire });
      }
      else {
        res.status(404).json({ message: "Questionnaire not found" });
      }
    }
    catch (err) {
      console.log("Error while cloning questions : " + err);
    }
  } else {
    await feedback.populate({ path: `${type}.questionnaire` });
    res.json({ feedback: feedback });
  }
});

router.post('/create', authenticateJwt, async (req, res) => {
  const { eventId, volunteerId, answers } = req.body;
  const { toUpdate, updateInfo } = req.body;
  const feedback = await Feedback.findOne({ eventId: eventId, volunteerId: volunteerId });
  const volunteer = await Volunteer.findById(volunteerId);
  if (feedback) {
    //feedback submit logic
    const adminId = req.user.id;
    for (const answer of answers) {
      const question = await Questionnaire.findById(answer.questionId);
      if (!question)
        throw new Error(`Question not found for ${answer.questionId}`);
      if (question.type === 'multiple-choice') {
        question.options.forEach((option) => {
          option.selected = answer.selectedOptions.includes(option.name);
        });
      }
      else if (question.type === 'single-choice') {
        for (option of question.options) {
          option.selected = false;
        }
        // question.options.forEach((option) => {
        //   if (option.name === answer.selectedOptions[0]) {
        //     option.selected = true;
        //     if (option.name === 'Other')
        //       question.answer = answer.answer;
        //   }
        // });
        const selectedOption = question.options.find(option => option.name === answer.selectedOptions[0]);
        selectedOption.selected = true;
        if (selectedOption.name === 'Other')
          question.answer = answer.answer;
      }
      else if (question.type === 'long-answer') {
        question.answer = answer.answer;
      }
      await question.save();
    }
    feedback.givenBy = adminId;
    if (updateInfo) {
      feedback[feedback.type].status = updateInfo?.status || '';
      feedback[feedback.type].recommendation = updateInfo?.recommendation || '';
    }
    await feedback.save();
    if (!volunteer.feedbacks.includes(feedback._id)) {
      volunteer.feedbacks.push(feedback._id);
      await volunteer.save();
    }
    res.status(201).json({ message: "feedback submitted", feedback: feedback });
  }
  else {
    res.status(500).json({ error: "Error while submitting the feedback" });
  }
});

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



module.exports = router;

