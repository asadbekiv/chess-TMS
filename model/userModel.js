// import mongoose, { Schema } from 'mongoose';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  rating: { type: Number, required: true },
  role: { type: String, enum: ['admin', 'player'], default: 'user' },
  country: {
    name: { type: String },
    code: { type: String },
    continent: { type: String },
    capital: { type: String },
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

export const User = mongoose.model('User', userSchema);
