import express from 'express';
import createTournament from '../controllers/tournamentController.js';
import {
  getAllTournaments,
  deleteTournament,
} from '../controllers/tournamentController.js';
import { restrictTo, protect } from '../controllers/authController.js';
const router = express.Router();

router.post('/create', restrictTo('admin'), createTournament);

router.use(protect);
router.get('/', getAllTournaments);
router.route('/:id').delete(restrictTo('admin'), deleteTournament);

export default router;
