import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected successfull !');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const port = process.env.PORT;

// console.log(port);
app.listen(port, () => {
  console.log(`Server is runnig on PORT ${port} !`);
});
