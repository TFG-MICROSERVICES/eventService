import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../db/services/eventsServices.js';
import { createLeague, getLeagueById, updateLeague } from '../db/services/leaguesServices.js';
import { createTournament, getTournament, updateTournament } from '../db/services/tournamentServices.js';
import { eventSchema, updateEventSchema } from '../schemas/eventSchema.js';
import { leagueSchema, updateLeagueSchema } from '../schemas/leagueSchema.js';
import { tournamentSchema, updateTournamentSchema } from '../schemas/tournamentSchema.js';
import { generateError } from '../utils/generateError.js';

export const createEventController = async (req, res, next) => {
    try {
        const validatedEvent = await eventSchema.validateAsync(req.body);

        const event = await createEvent(validatedEvent);

        if (event && validatedEvent.event_type === 'tournament') {
            req.body.event_id = event;
            const validateTournament = await tournamentSchema.validateAsync(req.body);
            await createTournament(validateTournament);
        } else if (event && validatedEvent.event_type === 'league') {
            req.body.event_id = event;
            const validateLeague = await leagueSchema.validateAsync(req.body);
            await createLeague(validateLeague);
        }

        res.status(201).json({
            status: 201,
            message: 'Evento creado correctamente',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

export const getEventsController = async (req, res, next) => {
    try {
        const events = await getEvents();

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
        next(error);
    }
};

export const getEventByIdController = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        if (!eventId) generateError('El id del evento es requerido', 400);

        const event = await getEventById(eventId);

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

export const updateEventController = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        if (!eventId) generateError('El id del evento es requerido', 400);

        const validatedEvent = await updateEventSchema.validateAsync(req.body);

        const event = await updateEvent(eventId, validatedEvent);

        if (event.event_type === 'tournament') {
            const validatedTournament = await updateTournamentSchema.validateAsync(req.body);
            await updateTournament(eventId, validatedTournament);
        } else if (event.event_type === 'league') {
            const validateLeague = await await updateLeagueSchema.validateAsync(req.body);
            await updateLeague(eventId, validateLeague);
        }

        res.status(200).json({
            status: 200,
            message: 'Evento actualizado correctamente',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteEventController = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        if (!eventId) generateError('El id del evento es requerido', 400);

        const event = await deleteEvent(eventId);

        res.status(200).json({
            status: 200,
            message: 'Evento eliminado correctamente',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};
