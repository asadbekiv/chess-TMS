import AppError from '../utils/AppError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// const sendErrorProd = (err, res) => {
//   if (req.originalUrl.startsWith('/api')) {
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     }
//   }
//   if (err.isOperational) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }
// };
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     error: err,
  //     message: err.message,
  //     stack: err.stack,
  //   });
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// const sendErrorDev = (err, req, res, next) => {
//   if (req.originalUrl.startsWith('/api')) {
//     return res.status(err.statusCode).json({
//       message: err.message,
//       error: err,
//       status: err.status,
//       stack: err.stack,
//     });
//   }
// };

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     // let error = { ...err };
//     // if (error.name === 'CastError') error = handleCastErrorDB(error);
//     // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     // if (error.name === 'ValidationError')
//     //   error = handleValidationErrorDB(error);
//     // if (error.name === 'JsonWebTokenError') error = handleJWTError();
//     // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
//     sendErrorProd(err, res);
//   }

export default errorHandler;
