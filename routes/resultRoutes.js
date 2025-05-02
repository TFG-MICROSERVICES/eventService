import express from "express";
import { createResultLeagueController, updateResultController } from "../controllers/resultControllers.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";

const router = express.Router();

//POST http://localhost:3005/results/
router.post('/:event_id', validateApiKey, createResultLeagueController);

//PUT http://localhost:3005/results/:result_id
router.put('/:result_id', validateApiKey, updateResultController);

export default router;