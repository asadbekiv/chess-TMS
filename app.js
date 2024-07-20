import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import usersRouter from './routes/usersRoute.js';
import helmet from 'helmet';
import morgan from 'morgan';
import tournamentRouter from './routes/tournamentRoute.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/AppError.js';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// console.log(__dirname, __filename);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} => ${req.url}`);
  next();
});

// console.log(process.env.NODE_ENV);

app.use('/api/v1/tournament', tournamentRouter);
app.use('/api/v1/users', usersRouter);

// console.log(process.env.dev);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Bu  ${req.originalUrl} url serverdan topilmadi !`, 404));
});
app.use(globalErrorHandler);

export default app;
