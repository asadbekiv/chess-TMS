import mongoose from 'mongoose';
const { Schema } = mongoose;

const tournamentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

tournamentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'participants',
    select: '- __v -passwordChangedAt -password',
  });
});

tournamentSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    next(new Error(`Boshlanish sanasi tugash sanasidan oldin bo'lishi kerak`));
  } else {
    next();
  }
});

tournamentSchema.virtual('formattedStartDate').get(function () {
  return this.startDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

tournamentSchema.virtual('formattedEndDate').get(function () {
  return this.endDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});
tournamentSchema.set('toJSON', { virtuals: true });
tournamentSchema.set('toObject', { virtuals: true });

export const Tournament = mongoose.model('Tournament', tournamentSchema);
