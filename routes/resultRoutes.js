import express from "express";
import { createResultLeagueController, updateResultController } from "../controllers/resultControllers.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";

const router = express.Router();

//POST http://localhost:3005/results/
router.post('/', validateApiKey, createResultLeagueController );

//PUT http://localhost:3005/results/:result_id
router.put('/:event_id', validateApiKey, updateResultController);

export default router;