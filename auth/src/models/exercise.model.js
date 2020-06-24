import mongoose from 'mongoose';
import shortid from 'shortid';

let Schema = mongoose.Schema;

let exerciseSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [6, 'The title must be 6 to 80 characters'],
    maxlength: [80, 'The fullname must be 6 to 80 characters'],
  },
  description: String,
  dateLimit: Date,
  teacher: {
    fullname: String,
    id: String,
  },
  students: [
    {
      fullname: String,
      id: String,
    },
  ],
  questions: [
    {
      description: String,
      teacherSolution: String,
      databaseLocation: String,
      resolutions: [
        {
          fullname: String,
          id: String,
          solutions: [String],
        },
      ],
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: [Date],
    default: Date.now,
  },
});

exerciseSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'],
  function (next) {
    let updateObject = this.getUpdate();
    updateObject['$push'] = updateObject['$push'] || {};
    updateObject['$push']['updated'] = Date.now();

    this.update(updateObject);
    next();
  }
);

export default mongoose.model('Exercise', exerciseSchema);
