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
            generateError('No hay suficientes equipos para crear enfrentamientos', 400);
        }

        let matchs = [];
        if (teams.length === 2) {
            // Caso especial: ida y vuelta para dos equipos
            matchs.push({
                home_team_id: teams[0].team_id,
                away_team_id: teams[1].team_id,
                event_id: event_id,
                score_home: 0,
                score_away: 0,
                round: 1
            });
            matchs.push({
                home_team_id: teams[1].team_id,
                away_team_id: teams[0].team_id,
                event_id: event_id,
                score_home: 0,
                score_away: 0,
                round: 2
            });
        } else if (league.round_robin && teams.length > 2) {
            // Algoritmo para repartir partidos en jornadas (round robin solo ida)
            let teamIds = teams.map(t => t.team_id);
            console.log(teamIds);
            const numTeams = teamIds.length;
            let numRounds = numTeams - 1;

            if (numTeams % 2 !== 0) {
                teamIds.push(null);
                numRounds = teamIds.length - 1;
            }

            const totalTeams = teamIds.length;

            for (let round = 0; round < numRounds; round++) {
                for (let i = 0; i < totalTeams / 2; i++) {
                    const home = teamIds[i];
                    const away = teamIds[totalTeams - 1 - i];
                    if (home !== null && away !== null) {
                        matchs.push({
                            home_team_id: home,
                            away_team_id: away,
                            event_id: event_id,
                            score_home: 0,
                            score_away: 0,
                            round: round + 1
                        });
                    }
                }
                // Rotar los equipos (excepto el primero)
                teamIds.splice(1, 0, teamIds.pop());
            }
        } else {
            // Enfrentamientos aleatorios, cada partido en una jornada distinta
            let shuffled = teams.slice().sort(() => Math.random() - 0.5);
            let round = 1;
            for (let i = 0; i < shuffled.length - 1; i += 2) {
                matchs.push({
                    home_team_id: shuffled[i].team_id,
                    away_team_id: shuffled[i + 1].team_id,
                    event_id: event_id,
                    score_home: 0,
                    score_away: 0,
                    round: round++
                });
            }
            // Si hay un equipo impar, el último queda sin rival en la última jornada
            if (shuffled.length % 2 !== 0) {
                matchs.push({
                    home_team_id: shuffled[shuffled.length - 1].team_id,
                    away_team_id: null,
                    event_id: event_id,
                    score_home: 0,
                    score_away: 0,
                    round: round
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