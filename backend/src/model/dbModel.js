const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nakshsinghhh1:CNP2DaBXwJLf5ZYC@demo.vlottuc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  programCoordinators: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  published: Boolean,
  image: String
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['potential', 'training'] },
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }]
});

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  remark: String,
  feedback: String,
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Admin = mongoose.model('Admin', adminSchema);
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = {
  Admin,
  User,
  Event,
  Volunteer,
  Feedback
};
