import { Router } from 'express';
import { validateApiKey } from '../middlewares/validateApiKey.js';
import { createTeamEventController, deleteTeamByIdControler, getTeamsEventByIdController } from '../controllers/teamEventControllers.js';

const router = Router();

router.get('/event/:event_id', validateApiKey, getTeamsEventByIdController);

router.post('/', validateApiKey, createTeamEventController);

router.delete('/event/:event_id', validateApiKey, deleteTeamByIdControler);

export default router;
