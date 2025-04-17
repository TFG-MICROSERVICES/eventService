import { League } from '../../models/league.js';
import { generateError } from '../../utils/generateError.js';

export const createLeague = async (data) => {
    try {
        const league = await League.create(data);

        return league;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const getLeagues = async () => {
    try {
        const leagues = await League.findAll();
        return leagues;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const getLeagueById = async (event_id) => {
    try {
        const league = await League.findOne({
            where: { event_id: event_id },
        });

        if (!league) generateError('League not found', 404);

        return league;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const updateLeague = async (event_id, leagueData) => {
    try {
        const league = await League.findOne({
            where: { event_id: event_id },
        });

        if (!league) generateError('League not found', 404);

        await league.update(leagueData);

        return league;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const deleteLeague = async (event_id) => {
    try {
        const league = await League.findAll({
            where: { event_id: event_id },
        });

        if (!league) generateError('League not found', 404);

        await league.destroy();

        return true;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};
