import { Tournament } from '../../models/tournament.js';
import { generateError } from '../../utils/generateError.js';

export const createTournament = async (data) => {
    try {
        const tournament = await Tournament.create(data);

        return tournament;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getTournament = async (event_id) => {
    try {
        const tournament = await Tournament.findOne({
            where: { event_id: event_id },
        });

        if (!tournament) {
            generateError('Torneo no encontrado', 404);
        }

        return tournament;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateTournament = async (event_id, data) => {
    try {
        const tournament = await Tournament.findOne({
            where: { event_id: event_id },
        });

        if (!tournament) {
            generateError('Torneo no actualizado', 404);
        }

        await tournament.update(data);

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteTournament = async (event_id) => {
    try {
        const tournament = await Tournament.findAll({
            where: { event_id: event_id },
        });

        if (!tournament) {
            generateError('Tornero no eliminado');
        }

        await tournament.destroy();

        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
