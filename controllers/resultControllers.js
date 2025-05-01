import { getLeagueById } from "../db/services/leaguesServices.js";
import { getTeamsEventByIdService } from "../db/services/teamEventServices.js";
import { generateError } from "../utils/generateError.js";
import { createResultsService, updateResultService } from '../db/services/resultServices.js';
import { updateResultSchema } from "../schemas/resultSchema.js";

export const createResultLeagueController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        const league = await getLeagueById(event_id);
        const teams = await getTeamsEventByIdService(event_id);

        if (!teams || teams.length < 2) {
            return res.status(400).json({
                status: 400,
                message: 'No hay suficientes equipos para crear enfrentamientos',
            });
        }

        let matchs = [];

        if (league.round_robin && teams.length > 2) {
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    matchs.push({
                        home_team_id: teams[i].team_id,
                        away_team_id: teams[j].team_id,
                        event_id: event_id,
                        round: 1
                    });
                }
            }
        } else {
            let shuffled = teams.slice().sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffled.length - 1; i += 2) {
                matchs.push({
                    home_team_id: shuffled[i].team_id,
                    away_team_id: shuffled[i + 1].team_id,
                    event_id: event_id,
                });
            }
            if (shuffled.length % 2 !== 0) {
                matchs.push({
                    home_team_id: shuffled[shuffled.length - 1].team_id,
                    away_team_id: null,
                    event_id: event_id,
                });
            }
        }

        // Guarda los partidos en la base de datos
        const results = await createResultsService(matchs);

        res.status(201).json({
            status: 201,
            message: 'Enfrentamientos creados y guardados correctamente',
            data: results,
        });
    } catch (error) {
        next(error);
    }
};

export const updateResultController = async (req, res, next) => {
    try{
        const { result_id } = req.params;
        
        const validate = await updateResultSchema.validateAsync(req.body, { stripUnknown: true});

        await updateResultService(result_id, validate);

        res.status(200).json({
            status:200,
            message: 'Resultado actualizado correctamente'
        });
    }catch(error){
        next(error);
    }
}