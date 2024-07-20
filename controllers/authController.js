import express from 'express';
import 'dotenv/config';
import { User } from '../model/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

// Function to create and send a token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Set the cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Send the cookie with token
  res.cookie('jwt', token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, age, rating, country, password, passwordConfirm } =
    req.body;
  if (
    !name ||
    !age ||
    !rating ||
    !country ||
    !password ||
    !passwordConfirm ||
    !email
  ) {
    return res.status(400).json({
      status: 'fail',
      message: `Barcha fields to'ldirish talab qilinadi`,
    });
  }
  const newUser = await User.create({
    name,
    email,
    age,
    rating,
    country,
    password,
    passwordConfirm,
  });
  const token = signToken(newUser._id);

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(`Ismingiz va Maxfiy so'zni kirting,iltimos !`, 400)
    );
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(`Noto'g'ri maxfiy so'z yoki Elektron pochta `, 401)
    );
  }

  const token = signToken(user._id);
  //   console.log(req.user);

  createSendToken(user, 200, res);
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Sizda bu operatsiyani bajarishga ruxsat yo'q !`));
    }
    next();
  };
};

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Siz tizimga kirmagansiz, amalni bajarish uchun tizimga kiring',
        201
      )
    );
  }

  try {
    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const currentUser = await User.findById(decoded.id);

    // If no user is found, return an error
    if (!currentUser) {
      return next(
        new AppError('Ushbu tokenga tegishli foydalanuvchi mavjud emas!', 401)
      );
    }

    // Add the user to the request object
    req.user = currentUser;
    next();
  } catch (err) {
    // If token verification fails, return an error
    return next(new AppError(`Token noto'g'ri yoki muddati o'tgan!`, 401));
  }
});
