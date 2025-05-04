import { getLeagueById } from "../db/services/leaguesServices.js";
import { getTeamsEventByIdService } from "../db/services/teamEventServices.js";
import { generateError } from "../utils/generateError.js";
import { createResultsService, deleteResultByEventService, getResultsByEventIdService, updateResultService } from '../db/services/resultServices.js';
import { updateResultSchema } from "../schemas/resultSchema.js";
import { shuffleArray } from "../utils/suffleArray.js";
import { getTournament, updateTournament } from "../db/services/tournamentServices.js";
import { getEventById } from "../db/services/eventsServices.js";

function isPowerOfTwo(n) {
    return n > 1 && (n & (n - 1)) === 0;
}

export const createResultLeagueController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        const event = await getEventById(event_id);

        // --- LÓGICA PARA TORNEOS ---
        if (event.event_type === 'tournament') {
            let teams = await getTeamsEventByIdService(event_id);
            const tournament = await getTournament(event_id);
            const type_of_elimination = tournament.elimination_type;

            if (!teams || teams.length < 2) {
                return generateError('No hay suficientes equipos para crear enfrentamientos', 400);
            }

            if (!isPowerOfTwo(teams.length)) {
                generateError('Faltan equipos para generar los enfrentamientos.', 400);
            }

            // Eliminar resultados previos si existen
            const existsResults = await getResultsByEventIdService(event_id);

            //Comprobamos si quedan partidos por disputarse antes de hacer el sorteo de la siguiente ronda
            if(existsResults.length > 0){
                const matchNoPlayed = existsResults.find((result) => {
                    if(!result.playedAt){
                        return result;
                    }
                });
    
                if(matchNoPlayed){
                    generateError('Aún quedan partidos por disputarse', 400);
                }else{
                    //Obtenemos los equipos ganadores para ambos tipos de clasificaciones
                    if(type_of_elimination === 'single_elimination'){
                        const winnerTeamIds = existsResults.map(result =>
                            result.score_home > result.score_away ? result.home_team_id : result.away_team_id
                        );
                        teams = teams.filter(team => winnerTeamIds.includes(team.team_id));
                    } else if (type_of_elimination === 'double_elimination') {
                        const matchMap = new Map();

                        existsResults.forEach(result => {
                            // Crear una clave única para cada enfrentamiento, sin importar el orden de los equipos
                            const key = [result.home_team_id, result.away_team_id].sort().join('-');
                            if (!matchMap.has(key)) {
                                matchMap.set(key, []);
                            }
                            matchMap.get(key).push(result);
                        });

                        // Determinar los ganadores globales
                        const winnerTeamIds = [];
                        for (const [key, matches] of matchMap.entries()) {
                            if (matches.length === 2) {
                                // Sumar los goles de ambos partidos
                                const totalHome = matches[0].score_home + matches[1].score_away;
                                const totalAway = matches[0].score_away + matches[1].score_home;
                                if (totalHome > totalAway) {
                                    winnerTeamIds.push(matches[0].home_team_id);
                                } else {
                                    winnerTeamIds.push(matches[0].away_team_id);
                                }
                            }
                        }

                        teams = teams.filter(team => winnerTeamIds.includes(team.team_id));
                    }
                }
            }

            if (!type_of_elimination) {
                generateError('Debes indicar el tipo de eliminación', 400);
            }

            if (teams.length % 2 !== 0) {
                generateError('No se pueden crear enfrentamientos de eliminación con un número impar de equipos.', 400);
            }

            let shuffled = shuffleArray(teams);
            let numTeams = shuffled.length;
            let round = numTeams / 2; // Ej: 4 equipos => ronda 2 (semifinales), 2 equipos => ronda 1 (final)
            let phase = 1;
            let matchs = [];

            for (let i = 0; i < numTeams; i += 2) {
                if (i + 1 < numTeams) {
                    // Partido de ida
                    matchs.push({
                        home_team_id: shuffled[i].team_id,
                        away_team_id: shuffled[i + 1].team_id,
                        event_id: event_id,
                        score_home: 0,
                        score_away: 0,
                        round: round,
                        phase: phase
                    });
                    // Partido de vuelta si es doble eliminación
                    if (type_of_elimination === 'double_elimination' && teams.length > 2) {
                        matchs.push({
                            home_team_id: shuffled[i + 1].team_id,
                            away_team_id: shuffled[i].team_id,
                            event_id: event_id,
                            score_home: 0,
                            score_away: 0,
                            round: round,
                            phase: phase
                        });
                    }
                }
            }
            const results = await createResultsService(matchs);
            return res.status(201).json({
                status: 201,
                message: 'Enfrentamientos de eliminación creados correctamente',
                data: results,
            });
        }

        // --- LÓGICA PARA LIGAS ---
        // Si no es torneo sse aplica la lógica de generar enfrentamientos para una liga
        const league = await getLeagueById(event_id);
        const teams = await getTeamsEventByIdService(event_id);

        if (!teams || teams.length < 2) {
            return generateError('No hay suficientes equipos para crear enfrentamientos', 400);
        }

        if (!isPowerOfTwo(teams.length)) {
            return generateError('El número de equipos debe ser potencia de 2 para un torneo de eliminación.', 400);
        }

        // Nueva comprobación: equipos impares
        if (teams.length % 2 !== 0) {
            generateError('No se pueden crear enfrentamientos con un número impar de equipos', 400);
        }

        const existsResults = await getResultsByEventIdService(event_id);

        if (existsResults.length > 0) {
            await deleteResultByEventService(event_id);
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
            const numTeams = teamIds.length;
            let numRounds = numTeams - 1;

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
            let shuffled = shuffleArray(teams);
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
        }

        // Guarda los partidos en la base de datos
        const results = await createResultsService(matchs);

        res.status(201).json({
            status: 201,
            message: 'Enfrentamientos creados y guardados correctamente',
            data: results,
        });
    } catch (error) {
        console.log(error);
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
        console.log(error);
        next(error);
    }
}