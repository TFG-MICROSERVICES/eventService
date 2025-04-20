import { createTeamEventService, deleteTeamByIdService, getTeamsEventByIdService } from '../db/services/teamEventServices.js';
import { schemaTeamEvent } from '../schemas/schemaTeamEvent.js';

export const createTeamEventController = async (req, res, next) => {
    try {
        const { data } = req.body;

        console.log(data);

        const validate = await schemaTeamEvent.validateAsync(data, { stripUnknown: true });

        await createTeamEventService(validate);

        res.status(201).json({
            status: 201,
            message: 'Equipo inscrito correctamente',
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getTeamsEventByIdController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        const teams = await getTeamsEventByIdService(event_id);

        res.status(200).json({
            status: 200,
            message: 'Equipos obtenidos correctamente',
            data: teams,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTeamByIdControler = async (req, res, next) => {
    try {
        const { team_id } = req.params;

        await deleteTeamByIdService(team_id);

        res.status(200).json({
            status: 200,
            message: 'Equipo eliminado correctamente',
        });
    } catch (error) {
        next(error);
    }
};
