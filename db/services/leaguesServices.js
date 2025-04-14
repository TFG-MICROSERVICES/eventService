import { League } from '../../models/league.js';
import { generateError } from '../../utils/generateError.js';

export const createLeague = async (leagueData) => {
    try {
        const league = await League.create(leagueData);

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

export const getLeagueById = async (leagueId) => {
    try {
        const league = await League.findOne({
            where: { event_id: leagueId },
        });

        if (!league) generateError('League not found', 404);

        return league;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const updateLeague = async (leagueId, leagueData) => {
    try {
        const league = await League.findOne({
            where: { event_id: leagueId },
        });

        if (!league) generateError('League not found', 404);

        await league.update(leagueData);

        return league;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};

export const deleteLeague = async (leagueId) => {
    try {
        const league = await League.findOne({
            where: { event_id: leagueId },
        });

        if (!league) generateError('League not found', 404);

        await league.destroy();

        return true;
    } catch (error) {
        console.log(error);
        generateError(error);
    }
};
