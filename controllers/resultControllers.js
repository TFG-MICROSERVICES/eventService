import { getLeagueById } from "../db/services/leaguesServices.js";
import { getTeamsEventByIdService } from "../db/services/teamEventServices.js";
import { generateError } from "../utils/generateError.js";
import { createResultsService, deleteResultByEventService, getResultsByEventIdService, updateResultService } from '../db/services/resultServices.js';
import { updateResultSchema } from "../schemas/resultSchema.js";
import { shuffleArray } from "../utils/suffleArray.js";
import { getTournament, updateTournament } from "../db/services/tournamentServices.js";
import { getEventById } from "../db/services/eventsServices.js";

// Reparte equipos aleatoriamente en grupos
function assignTeamsToGroups(teams, numGroups) {
    const shuffled = shuffleArray(teams);
    const groups = Array.from({ length: numGroups }, (_, i) => ({
        group_id: i + 1,
        teams: []
    }));

    shuffled.forEach((team, idx) => {
        groups[idx % numGroups].teams.push(team);
    });

    return groups;
}

// Genera los partidos de cada grupo (solo un partido por pareja)
function generateGroupMatches(groups, event_id) {
    let matchs = [];
    for (const group of groups) {
        const teams = group.teams;
        let round = 1;
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matchs.push({
                    home_team_id: teams[i].team_id,
                    away_team_id: teams[j].team_id,
                    event_id: event_id,
                    group_id: group.group_id,
                    score_home: 0,
                    score_away: 0,
                    round: round++
                });
            }
        }
    }
    return matchs;
}

export const createResultLeagueController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        // Obtener el evento para saber si es liga o torneo
        const event = await getEventById(event_id);

        // --- LÓGICA PARA TORNEOS ---
        if (event.event_type === 'tournament') {
            const teams = await getTeamsEventByIdService(event_id);
            const tournament = await getTournament(event_id);
            const type_of_elimination = tournament.type_of_elimination;

            if (!teams || teams.length < 2) {
                return generateError('No hay suficientes equipos para crear enfrentamientos', 400);
            }

            // Eliminar resultados previos si existen
            const existsResults = await getResultsByEventIdService(event_id);
            if (existsResults.length > 0) {
                await deleteResultByEventService(event_id);
            }

            // --- TORNEO POR GRUPOS ---
            if (!tournament.generate_groups) {
                const num_groups = tournament.number_of_teams / tournament.team_for_group;

                if (!num_groups || num_groups < 1) {
                    return generateError('Debes indicar el número de grupos', 400);
                }
                if (teams.length % num_groups !== 0) {
                    return res.status(400).json({
                        status: 400,
                        message: 'El número de equipos debe ser divisible entre el número de grupos.',
                    });
                }

                // 1. Repartir equipos aleatoriamente en grupos
                const groups = assignTeamsToGroups(teams, num_groups);

                // 2. Generar los partidos de cada grupo
                const matchs = generateGroupMatches(groups, event_id);

                // 3. Guardar los partidos
                const results = await createResultsService(matchs);

                await updateTournament(event_id,{ generate_groups: true });

                return res.status(201).json({
                    status: 201,
                    message: 'Enfrentamientos de grupos creados correctamente',
                    data: results,
                });
            }

            // --- TORNEO ELIMINACIÓN DIRECTA ---
            if (tournament.generate_groups) {
                if (!type_of_elimination) {
                    return generateError('Debes indicar el tipo de eliminación', 400);
                }
                if (teams.length % 2 !== 0) {
                    return res.status(400).json({
                        status: 400,
                        message: 'No se pueden crear enfrentamientos de eliminación con un número impar de equipos.',
                    });
                }

                let shuffled = shuffleArray(teams);
                let numTeams = shuffled.length;
                let round = 1;
                let phase = 1;
                let matchs = [];

                while (numTeams > 1) {
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
                            if (type_of_elimination === 'double_elimination') {
                                matchs.push({
                                    home_team_id: shuffled[i + 1].team_id,
                                    away_team_id: shuffled[i].team_id,
                                    event_id: event_id,
                                    score_home: 0,
                                    score_away: 0,
                                    round: round + 1,
                                    phase: phase
                                });
                            }
                        }
                        // Si impar, el último pasa de ronda automáticamente (bye)
                    }
                    // Para la siguiente fase, reduce equipos a la mitad
                    numTeams = Math.floor(numTeams / 2);
                    round += (type_of_elimination === 'double_elimination') ? 2 : 1;
                    phase++;
                }

                const results = await createResultsService(matchs);
                return res.status(201).json({
                    status: 201,
                    message: 'Enfrentamientos de eliminación creados correctamente',
                    data: results,
                });
            }

            // Si no es ni group ni elimination, error
            return res.status(400).json({
                status: 400,
                message: 'Tipo de torneo no soportado. Usa "group" o "elimination".',
            });
        }

        // --- LÓGICA PARA LIGAS ---
        // Si no es torneo, se asume que es liga y se mantiene la lógica original
        const league = await getLeagueById(event_id);
        const teams = await getTeamsEventByIdService(event_id);

        if (!teams || teams.length < 2) {
            return generateError('No hay suficientes equipos para crear enfrentamientos', 400);
        }

        // Nueva comprobación: equipos impares
        if (teams.length % 2 !== 0) {
            return res.status(400).json({
                status: 400,
                message: 'No se pueden crear enfrentamientos con un número impar de equipos. Añade o elimina un equipo para continuar.',
            });
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