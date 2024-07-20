import express from 'express';
import { User } from '../model/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // console.log(res.body.name);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);

  if (!doc) {
    return MongoNetworkError(
      new AppError(`Bu ID bo'ticha hech qanday foydalanuvchi topilmadi !`)
    );
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`Bu ID bo'yicha foydalanuvchi topilmadi !`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError(`Bu ID bo'yicha foydalanuvchi topilmadi !`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});
