const { default: mongoose } = require("mongoose");
const { Questionnaire } = require("./dbModel");
const { options } = require("../routes/feedbackRoutes");



const predefinedTrainingQuestions = [
  {
    question: 'Which area were they co-ordinating?', type: 'multiple-choice',
    options: [
      { name: 'Hall set-up' }, { name: 'Ushering' }, { name: 'Dining' }, { name: 'Foodshifting' }, { name: 'Inside Hall' },
      { name: 'Full Co-support to Ishanga organiser' }, { name: 'Coordinator for hall' },
      { name: 'Coordinator for Dining' }, { name: 'Independently under Ishanga observation' },
      { name: 'Others' }]
  },
  {
    question: 'How did they handle the activity?', type: 'single-choice',
    options: [{ name: 'They were able to do it independently' }, { name: 'They could manage well' },
    { name: 'They need to improve' }, { name: 'They struggle with it' }]
  },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: 'Are they able to effectively communicate with volunteers, keep them together & get the activity done?', type: 'single-choice',
    options: [{ name: "They were able to do it independently" }, { name: "They could manage well" }, { name: "They need to improve" },
    { name: "They struggle with it" }]
  },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: 'Are they able to assign right activity to the right person?', type: 'single-choice',
    options: [{ name: "They were able to do it independently" }, { name: "They managed well" }, { name: "They need to improve" },
    { name: "They struggled with it" }, { name: "Not Applicable" }]
  },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: 'Are they willing to listen to the Organisers / Ishanga instructions and act in accordance with the same?', type: 'single-choice',
    options: [{ name: "Willing to listen and act" }, { name: "Unwilling to listen and act" }, { name: "Has resistance" }]
  },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: "Are they able to stretch physically as per the program's requirement?", type: 'single-choice',
    options: [{ name: "Able to stretch physically" }, { name: "Struggling physically" }]
  },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: 'Are they committed to the program schedule & available for what is needed for the program?', type: 'multiple-choice',
    options: [{ name: "On time for meetings" }, { name: "On time for activity" }, { name: "Missing during meetings" }, { name: "Missing during activity" },
    { name: "More focused on sadhana" }, { name: "Others" }]
  },
  { question: 'If Others please specify', type: 'long-answer' },
  { question: 'Could you elaborate', type: 'long-answer' },
  {
    question: 'Overall Feedback', type: 'single-choice', options: [{ name: "Can be trained for program organising." },
    { name: "Need more programs for volunteering." }, { name: "Can do the next full program Org independently under Ishanga observation" },
    { name: "Can do the next program Hall Coordination independently" }, { name: "Con do the next program Dining Coordination independently" },
    { name: "Cannot be trained" }]
  },
  { question: "Other Remarks (Anything else you'd like the training team to know.)", type: 'long-answer' }
];


const predefinedProgramVolunteerQuestions = [
  {
    question: 'Area of activity', type: 'single-choice',
    options: [{ name: 'Dining' }, { name: 'Ushering' }, { name: 'Inside hall' },
    { name: 'Hall setup' }, { name: 'Food Shifting' }, { name: 'Audio' }, { name: 'Other' }]
  },
  { question: 'Presentation(Appearance, dress code, body language)', type: 'long-answer' },
  {
    question: 'Communication(Interaction with volunteers)', type: 'single-choice',
    options: [{ name: 'Very good' }, { name: 'Needs improvement' }, { name: 'Not appropriate' }, { name: 'Other' }]
  },
  {
    question: 'Physical fitness(Are they able to stretch themselves)', type: 'single-choice',
    options: [{ name: 'Very good' }, { name: 'Needs improvement' }, { name: 'Not appropriate' }, { name: 'Other' }]
  },
  {
    question: 'Commitment and willingness towards activity', type: 'single-choice',
    options: [{ name: 'Very good' }, { name: 'Needs improvement' }, { name: 'Not appropriate' }, { name: 'Other' }]
  },
  {
    question: 'Remarks', type: 'single-choice', options: [{ name: 'Need to volunteer for more programs' },
    { name: 'They can be trained' }, { name: 'They are not suitable for training' }, { name: 'Other' }]
  },
  {
    question: 'If they can be trained which Area of activity do you think they will fit best?', type: 'single-choice',
    options: [{ name: 'Dining' }, { name: 'Ushering' }, { name: 'Inside hall' },
    { name: 'Hall setup' }, { name: 'Food Shifting' }, { name: 'Audio' }, { name: 'Other' }]
  },
  { question: 'Overall Feedback', type: 'long-answer' }
];

const savePredefinedAndUpdate = async () => {
  await mongoose.connect();

  const trainingQuestions = await Questionnaire.insertMany(predefinedTrainingQuestions.map(q => ({ ...q })));
  const trainingQuestionsId = trainingQuestions.map(ques => (ques._id));

  const programVolunteerQuestions = await Questionnaire.insertMany(predefinedProgramVolunteerQuestions.map(q => ({ ...q })));
  const programVolunteerQuestionsId = programVolunteerQuestions.map(ques => (ques._id));

  await Feedback.updateMany({ 'training.questionnaire': { $exists: false } },
    { $set: { 'training.questionnaire': trainingQuestionsId } });

  await Feedback.updateMany({ 'potential.questionnaire': { $exists: false } },
    { $set: { 'potential.questionnaire': potentialQuestionsId } });

  await Feedback.updateMany({ 'programVolunteer.questionnaire': { $exists: false } },
    { $set: { 'programVolunteer.questionnaire': programVolunteerQuestionsId } });

  console.log('Questions saved successfully');
  mongoose.connection.close();
}

module.exports = {
  savePredefinedAndUpdate,
  predefinedTrainingQuestions,
  predefinedProgramVolunteerQuestions,
  trainingQuestionsId,
  programVolunteerQuestionsId
}
