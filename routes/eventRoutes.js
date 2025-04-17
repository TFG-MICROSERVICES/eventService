import { Router } from 'express';
import {
    createEventController,
    getEventsController,
    getEventByIdController,
    updateEventController,
    deleteEventController,
    existsNameEvent,
} from '../controllers/eventControllers.js';
import { validateApiKey } from '../middlewares/validateApiKey.js';
const router = Router();

//GET http://localhost:3005/events
router.get('/', validateApiKey, getEventsController);

//GET http://localhost:3005/events/:eventId
router.get('/:event_id', validateApiKey, getEventByIdController);

//POST http://localhost:3005/events
router.post('/', validateApiKey, createEventController);

//POST http://localhost:3005/events/exists
router.post('/exists', validateApiKey, existsNameEvent);

//PUT http://localhost:3005/events/:eventId
router.put('/:event_id', validateApiKey, updateEventController);

//DELETE http://localhost:3005/events/:eventId
router.delete('/:event_id', validateApiKey, deleteEventController);

export default router;
