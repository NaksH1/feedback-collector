const express = require('express');
const router = express.Router();
const model = require('../model/dbModel');
const Event = model.Event;
const Volunteer = model.Volunteer;
const Feedback = model.Feedback;
const Questionnaire = model.Questionnaire;
const authenticateJwt = require('../middlewares/authentication');
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

router.get('/questions/:type', authenticateJwt, async (req, res) => {
  const type = req.params.type;
  console.log('type', type);
  let questions;
  switch (type) {
    case 'training':
      questions = await Questionnaire.find({ _id: { $in: trainingQuestionsId } });
      break;
    case 'programVolunteer':
      questions = await Questionnaire.find({ _id: { $in: programVolunteerQuestionsId } });
      break;
    default:
      return res.status(400).json({ message: "Feedback type not found" });
  }

  res.json({ questions: questions });
});

const createClonedFeedback = async (feedbackData) => {
  try {
    const { type, volunteerId, eventId, adminId } = feedbackData;
    let originalQuestions;
    switch (type) {
      case 'training':
        originalQuestions = await Questionnaire.find({ _id: { $in: trainingQuestionsId } });
        break;
      case 'programVolunteer':
        originalQuestions = await Questionnaire.find({ _id: { $in: programVolunteerQuestionsId } });
        break;
      default:
        return res.status(400).json({ message: 'Feedback type not found' });
    }
    const idMapping = {};
    const clonedQuestions = await Promise.all(originalQuestions.map(async (question) => {
      const clonedQuestion = question.toObject();
      const originalId = clonedQuestion._id.toString();
      delete clonedQuestion._id;
      const newQuestion = await Questionnaire.create(clonedQuestion);
      idMapping[originalId] = newQuestion._id.toString();
      return newQuestion;
    }));
    const newFeedback = new Feedback({
      eventId, volunteerId, givenBy: adminId, type,
      [type]: { questionnaire: clonedQuestions.map(q => q._id) }
    });

    await newFeedback.save();
    return { idMapping, newFeedback };
  }
  catch (error) {
    throw new Error('Failed to create feedback with cloned questions: ' + error.message);
  }
}

router.post('/create', authenticateJwt, async (req, res) => {
  const { eventId, volunteerId, type, answers } = req.body;
  const adminId = req.user.id;
  const volunteer = await Volunteer.findById(volunteerId);
  try {
    const { idMapping, newFeedback } = await createClonedFeedback({ eventId, volunteerId, type, adminId });
    for (const answer of answers) {
      const clonedQuestionId = idMapping[answer.questionId];
      const question = await Questionnaire.findById(clonedQuestionId);
      if (!question) {
        throw new Error(`Question not found for ${clonedQuestionId}`);
      }
      if (question.type === 'multiple-choice') {
        question.options.forEach((option) => {
          option.selected = answer.selectedOptions.includes(option.name);
        });
      } else if (question.type === 'single-choice') {
        question.options.forEach((option) => {
          if (option.name === answer.selectedOptions[0]) {
            option.selected = true;
            if (option.name === 'Other')
              question.answer = answer.answer;
          }
        });
      } else if (question.type === 'long-answer') {
        question.answer = answer.answer;
      }
      await question.save();
    }
    volunteer.feedbacks.push(newFeedback);
    await volunteer.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
  }
  catch (error) {
    res.status(500).json({ error: "Error while submitting feedback " + error });
  }
});



module.exports = router;

