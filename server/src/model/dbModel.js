const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://nakshsinghhh1:CNP2DaBXwJLf5ZYC@demo.vlottuc.mongodb.net/';
mongoose.connect(MONGO_URL);

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
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  programCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  volunteers: [{
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    type: { type: String, enum: ['potential', 'training', 'programVolunteer'] }
  }],
  published: Boolean,
  image: String
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  gender: { type: String, enums: ['Male', 'Female'] },
  city: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }]
});

const optionSchema = new mongoose.Schema({
  name: String,
  selected: { type: Boolean, default: false }
})

const questionnaireSchema = new mongoose.Schema({
  question: String,
  answer: String,
  type: { type: String, enums: ['single-choice', 'multiple-choice', 'long-answer'] },
  options: [optionSchema]
})

const potentialSchema = new mongoose.Schema({
  remarks: String,
  status: String,
  recommendation: String
});

const trainingSchema = new mongoose.Schema({
  questionnaire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire' }],
  status: String,
  recommendation: String
});

const programVolunteerSchema = new mongoose.Schema({
  questionnaire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire' }],
  status: String,
  recommendation: String
})

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  type: { type: String, enum: ['potential', 'training', 'programVolunteer'] },
  potential: potentialSchema,
  training: trainingSchema,
  programVolunteer: programVolunteerSchema,
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  deleted_at: { type: Date, default: null }
});

feedbackSchema.pre('validate', function(next) {
  switch (this.type) {
    case 'potential':
      this.training = undefined;
      this.programVolunteer = undefined;
      break;

    case 'training':
      this.potential = undefined;
      this.programVolunteer = undefined;
      break;

    case 'programVolunteer':
      this.potential = undefined;
      this.training = undefined;
      break;

    default:
      return next(new Error('Invalid feedback type'));
  }
  next();
});

feedbackSchema.methods.softDelete = function() {
  this.deleted_at = new Date();
  return this.save();
}

feedbackSchema.methods.restore = function() {
  this.deleted_at = null;
  return this.save();
}

feedbackSchema.statics.findNotDeleted = function() {
  return this.find({ deleted_at: { $eq: null } });
}

const Admin = mongoose.model('Admin', adminSchema);
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = {
  Admin,
  User,
  Event,
  Volunteer,
  Feedback,
  Questionnaire
};
