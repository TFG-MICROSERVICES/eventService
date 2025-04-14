import { Router } from 'express';
import {
    createEventController,
    getEventsController,
    getEventByIdController,
    updateEventController,
    deleteEventController,
} from '../controllers/eventControllers.js';
import { validateApiKey } from '../middlewares/validateApiKey.js';
const router = Router();

router.post('/', validateApiKey, createEventController);
router.get('/', validateApiKey, getEventsController);
router.get('/:eventId', validateApiKey, getEventByIdController);
router.put('/:eventId', validateApiKey, updateEventController);
router.delete('/:eventId', validateApiKey, deleteEventController);

export default router;
