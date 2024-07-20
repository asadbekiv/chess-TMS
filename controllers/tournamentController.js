import { User } from '../model/userModel.js';
import { Tournament } from '../model/tournamentModel.js';

import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const createTournament = catchAsync(async (req, res, next) => {
  const { name, startDate, endDate, participants } = req.body;
  if (!name || !startDate || !endDate || !participants) {
    return res.status(400).json({
      status: 'fail',
      message: `Barcha fields to'ldirish talab qilinadi`,
    });
  }

  const newTournament = await Tournament.create({
    name,
    startDate,
    endDate,
    participants,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newTournament,
    },
  });
});

export const getAllTournaments = catchAsync(async (req, res, next) => {
  const allTournaments = await Tournament.find().populate({
    path: 'participants',
    select: '-__v -passwordChangedAt -password',
  });

  if (!allTournaments || allTournaments.length === 0) {
    return next(new AppError(`Musobaqalar mavjud emas !`, 400));
  }
  console.log(allTournaments);

  res.status(200).json({
    status: 'success',
    results: allTournaments.length,
    data: allTournaments,
  });
});

export const deleteTournament = catchAsync(async (req, res, next) => {
  const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
  if (!deletedTournament) {
    next(new AppError(`Hech qanday Musobaqa topilmadi bu ID bo'yicha !`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

export default createTournament;
