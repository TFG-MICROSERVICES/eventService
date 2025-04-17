import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, checkExistsNameEvent } from '../db/services/eventsServices.js';
import { createLeague, getLeagueById, updateLeague } from '../db/services/leaguesServices.js';
import { createTournament, getTournament, updateTournament } from '../db/services/tournamentServices.js';
import { eventSchema, updateEventSchema } from '../schemas/eventSchema.js';
import { leagueSchema, updateLeagueSchema } from '../schemas/leagueSchema.js';
import { tournamentSchema, updateTournamentSchema } from '../schemas/tournamentSchema.js';
import { generateError } from '../utils/generateError.js';

export const createEventController = async (req, res, next) => {
    try {
        const validatedEvent = await eventSchema.validateAsync(req.body, { stripUnknown: true });

        const event = await createEvent(validatedEvent);

        if (event && validatedEvent.event_type === 'tournament') {
            req.body.event_id = (await event.toJSON()).id;
            const validateTournament = await tournamentSchema.validateAsync(req.body, { stripUnknown: true });
            const tournament = await createTournament(validateTournament);
            if (!tournament) {
                await deleteEvent(req.body.event_id);
            }
        } else if (event && validatedEvent.event_type === 'league') {
            req.body.event_id = (await event.toJSON()).id;
            const validateLeague = await leagueSchema.validateAsync(req.body, { stripUnknown: true });
            const league = await createLeague(validateLeague);
            if (!league) {
                await deleteEvent(req.body.event_id);
            }
        }

        res.status(201).json({
            status: 201,
            message: 'Evento creado correctamente',
            data: event,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getEventsController = async (req, res, next) => {
    try {
        const events = await getEvents();

        console.log(events);

        const eventsWithData = await Promise.all(
            events.map(async (event) => {
                if (event.event_type === 'tournament') {
                    const tournament = await getTournament(event.id);
                    return { ...event, tournament: tournament };
                } else if (event.event_type === 'league') {
                    const league = await getLeagueById(event.id);
                    return { ...event, league };
                } else {
                    return event;
                }
            })
        );

        res.status(200).json({
            status: 200,
            message: 'Eventos obtenidos correctamente',
            data: eventsWithData,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getEventByIdController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        const event = await getEventById(event_id);

        let eventWithData;
        if (event.event_type === 'tournament') {
            const tournament = await getTournament(event.id);
            eventWithData = { ...event, tournament: tournament };
        } else if (event.event_type === 'league') {
            const league = await getLeagueById(event.id);
            eventWithData = { ...event, league };
        } else {
            eventWithData = event;
        }

        res.status(200).json({
            status: 200,
            message: 'Evento obtenido correctamente',
            data: eventWithData,
        });
    } catch (error) {
        next(error);
    }
};

export const existsNameEvent = async (req, res, next) => {
    try {
        const { event } = req.body;

        console.log(event);

        const exists = await checkExistsNameEvent(event.name);

        res.status(200).json({
            status: 200,
            data: exists,
        });
    } catch (error) {
        next(error);
    }
};

export const updateEventController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        console.log(req.body);

        const validatedEvent = await updateEventSchema.validateAsync(req.body, { stripUnknown: true });

        const event = await updateEvent(event_id, validatedEvent);

        if (event.event_type === 'tournament') {
            req.body.tournament.event_id = req.body.id;
            const validatedTournament = await updateTournamentSchema.validateAsync(req.body.tournament, { stripUnknown: true });
            await updateTournament(event_id, validatedTournament);
        } else if (event.event_type === 'league') {
            req.body.league.event_id = req.body.id;
            const validateLeague = await await updateLeagueSchema.validateAsync(req.body.league, { stripUnknown: true });
            await updateLeague(event_id, validateLeague);
        }

        res.status(200).json({
            status: 200,
            message: 'Evento actualizado correctamente',
            data: event,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteEventController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        const event = await deleteEvent(event_id);

        res.status(200).json({
            status: 200,
            message: 'Evento eliminado correctamente',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};
