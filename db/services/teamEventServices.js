import { TeamEvent } from '../../models/teamsEvents.js';
import { generateError } from '../../utils/generateError.js';

export const createTeamEventService = async (data) => {
    try {
        const teamEvent = await TeamEvent.create(data);

        if (!teamEvent) {
            generateError('Error al inscribir al equipo', 500);
        }

        return teamEvent;
    } catch (error) {
        throw error;
    }
};

export const getTeamsEventByIdService = async (event_id) => {
    try {
        const teams = await TeamEvent.findAll({
            where: { event_id: event_id },
        });

        const data = await Promise.all(
            teams.map(async (currentTeam) => {
                const team = await currentTeam.toJSON();
                if (!team) {
                    generateError('Error al obtener los equipos', 500);
                }
                return team;
            })
        );

        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteTeamByIdService = async (team_id) => {
    try {
        const team = await TeamEvent.findOne({
            where: { team_id: team_id },
        });

        if (!team) {
            generateError('Error al eliminar el equipo');
        }

        await team.destroy();

        return true;
    } catch (error) {
        throw error;
    }
};
