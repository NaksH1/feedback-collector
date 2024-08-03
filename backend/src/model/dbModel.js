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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }]
});

const potentialSchema = new mongoose.Schema({
  remarks: String
});

const choiceSchema = new mongoose.Schema({
  choice1: { type: Boolean, default: false },
  choice2: { type: Boolean, default: false },
  choice3: { type: Boolean, default: false },
  choice4: { type: Boolean, default: false },
  choice5: { type: Boolean, default: false },
  choice6: { type: Boolean, default: false },
  choice7: { type: Boolean, default: false },
  choice8: { type: Boolean, default: false },
  choice9: { type: Boolean, default: false },
  choice10: { type: Boolean, default: false }
});

const availableSchema = new mongoose.Schema({
  achoice1: { type: Boolean, default: false },
  achoice2: { type: Boolean, default: false },
  achoice3: { type: Boolean, default: false },
  achoice4: { type: Boolean, default: false },
  achoice5: { type: Boolean, default: false },
  achoice6: { type: Boolean, default: false }
});

const trainingSchema = new mongoose.Schema({
  areas: choiceSchema,
  activity: String,
  comment1: String,
  communicate: String,
  comment2: String,
  assign: String,
  comment3: String,
  listen: String,
  comment4: String,
  stretch: String,
  comment5: String,
  available: availableSchema,
  others: String,
  comment6: String,
  overall: String,
  remarks: String
});

const programVolunteerSchema = new mongoose.Schema({
  area: String,
  presentation: String,
  communication: String,
  fitness: String,
  commitment: String,
  remarks: String,
  areaCanBeTrained: String,
  overall: String
})

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  type: { type: String, enum: ['potential', 'training', 'programVolunteer'] },
  potential: potentialSchema,
  training: trainingSchema,
  programVolunteer: programVolunteerSchema,
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
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
