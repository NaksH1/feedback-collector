const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nakshsinghhh1:CNP2DaBXwJLf5ZYC@demo.vlottuc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String
});

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  programCoordinators: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  published: Boolean,
  image: String
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  type: { type: String, enum: ['potential', 'training'] },
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }]
});

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  remark: String,
  areas: {
    choice1: { type: Boolean, default: false },
    choice2: { type: Boolean, default: false }, choice3: { type: Boolean, default: false }, choice4: { type: Boolean, default: false },
    choice5: { type: Boolean, default: false }, choice6: { type: Boolean, default: false }, choice7: { type: Boolean, default: false },
    choice8: { type: Boolean, default: false }, choice9: { type: Boolean, default: false }, choice10: { type: Boolean, default: false }
  },
  activity: String, comment1: String, communicate: String, comment2: String, assign: String, comment3: String,
  listen: String, comment4: String, stretch: String, comment5: String,
  available: {
    achoice1: { type: Boolean, default: false }, achoice2: { type: Boolean, default: false },
    achoice3: { type: Boolean, default: false }, achoice4: { type: Boolean, default: false },
    achoice5: { type: Boolean, default: false }, achoice6: { type: Boolean, default: false }
  },
  others: String, comment6: String, overall: String, remarks: String,
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
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
