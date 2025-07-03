import express from 'express';
import { cadastrarAluno } from '../controllers/matriculaController.js';

const router = express.Router();

router.post('/matricula', cadastrarAluno);

export default router;
