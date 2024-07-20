import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
} from '../controllers/usersController.js';
import {
  signup,
  login,
  protect,
  restrictTo,
} from '../controllers/authController.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);

router.use(protect);
router.get('/', getAllUsers);
router
  .route('/:id')
  .delete(restrictTo('admin'), deleteUser)
  .get(getUser)
  .patch(restrictTo('admin'), updateUser);

export default router;
