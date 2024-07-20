import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  rating: { type: Number, required: true },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Elektron pochta manzil talab qilinadi !'],
    validate: [
      validator.isEmail,
      `Iltimos, to'g'ri elektron pochta kiriting !`,
    ],
  },
  role: { type: String, enum: ['admin', 'player'], default: 'player' },
  country: {
    type: String,
    required: [true, 'mamlakat tanlang iltimos !'],
  },

  password: {
    type: String,
    required: [true, `iltimos, maxfiy so'z  kiriting.`],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, `maxfiy so'zni tasdiqlang.`],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: ` maxfiy so'zni tasdiqlash mos kelmadi.`,
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model('User', userSchema);
