import mongoose from 'mongoose';
import argon2 from 'argon2';
import logger from '../utils/logger';

let Schema = mongoose.Schema;

let userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [6, 'The fullname must be 6 to 60 characters'],
    maxlength: [60, 'The fullname must be 6 to 60 characters'],
    validate: {
      validator: (value) => {
        let names = value.split(' ');
        names = names.filter((item) => item.length > 1);
        return names.length >= 2;
      },
      message: ({ value }) => `${value} is not a valid fullname`,
    },
  },
  email: {
    type: String,
    required: [true, 'This field is required'],
    unique: true,
    validate: {
      validator: (value) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/.test(value),
      message: ({ value }) => `${value} is not a valid email`,
    },
  },
  username: {
    type: String,
    required: [true, 'This field is required'],
    unique: true,
    minlength: [6, 'The username must be 6 to 40 characters'],
    maxlength: [40, 'The username must be 6 to 40 characters'],
    validate: {
      validator: (value) => /^[a-zA-Z0-9._-]{6,}$/.test(value),
      message: ({ value }) => `${value} is not a valid username`,
    },
  },
  password: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [8, 'The password must be 8 or more characters'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['Teacher', 'Student'],
    default: 'Student',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: [
    {
      type: Date,
      default: Date.now,
    },
  ],
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    argon2.hash(this.password).then((hash) => {
      logger.debug('password hash', hash);
      this.password = hash;
    });
  }
  return next();
});

export default mongoose.model('User', userSchema);
