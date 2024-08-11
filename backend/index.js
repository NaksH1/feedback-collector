const express = require('express');
const app = express();
const adminRoutes = require('./src/routes/adminRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const eventRoutes = require('./src/routes/eventRoutes.js');
const volunteerRoutes = require('./src/routes/volunteerRoutes.js');
const feedbackRoutes = require('./src/routes/feedbackRoutes.js');
const cors = require('cors');
const { savePredefinedAndUpdate, loadQuestionsId, programVolunteerQuestionsId, trainingQuestionsId } = require('./src/model/initQuestions.js');
const { Questionnaire, Feedback, connectDB, checkConnectionStatus } = require('./src/model/dbModel.js');
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: "ok" });
})

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/volunteer', volunteerRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

const startServer = async (Questionnaire) => {
  try {
    const existingQuestionnaire = await Questionnaire.findOne({ question: 'How did they handle the activity?' });
    if (!existingQuestionnaire) {
      await savePredefinedAndUpdate(Questionnaire);
      console.log('Predefined Questions saved');
    }
  }
  catch (err) {
    console.log('Failed to save predefined questions', err);
  }
}
startServer(Questionnaire);

loadQuestionsId(Questionnaire).then(() => {
  console.log("Question Ids updated");
})


