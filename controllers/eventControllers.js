import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, checkExistsNameEvent } from '../db/services/eventsServices.js';
import { createLeague, getLeagueById, updateLeague } from '../db/services/leaguesServices.js';
import { getResultsByEventIdService } from '../db/services/resultServices.js';
import { getTeamsEventByIdService } from '../db/services/teamEventServices.js';
import { createTournament, getTournament, updateTournament } from '../db/services/tournamentServices.js';
import { createUserEventService, getEventsByUserService, getUserEventByIdService } from '../db/services/userEventServices.js';
import { eventSchema, updateEventSchema } from '../schemas/eventSchema.js';
import { leagueSchema, updateLeagueSchema } from '../schemas/leagueSchema.js';
import { tournamentSchema, updateTournamentSchema } from '../schemas/tournamentSchema.js';
import { generateError } from '../utils/generateError.js';

export const createEventController = async (req, res, next) => {
    try {
        const validatedEvent = await eventSchema.validateAsync(req.body, { stripUnknown: true });

        const event = await createEvent(validatedEvent);

        //Creamos el objeto que asocia al usuario con el evento que ha creado
        const data = {
            event_id: event.id,
            user_id: req.body.user_id,
        };

        //Creamos la asociacion entre evento y usuario
        await createUserEventService(data);

        if (event && validatedEvent.event_type === 'tournament') {
            req.body.event_id = (await event.toJSON()).id;
            console.log(req.body);
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
        const { sport_id } = req.query;

        const events = await getEvents(sport_id);

        const eventsWithData = await Promise.all(
            events.map(async (event) => {
                const teams = await getTeamsEventByIdService(event.id);
                const owner = await getUserEventByIdService(event.id);
                const base = { ...event, teams, owner };
                if (event.event_type === 'tournament') {
                    base.tournament = await getTournament(event.id);
                } else if (event.event_type === 'league') {
                    base.league = await getLeagueById(event.id);
                }
                const results = await getResultsByEventIdService(event.id);
                if (results) base.results = results;
                return base;
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

export const getEventsByUserController = async (req, res, next) => {
    try{
        const { user_id} = req.params;
        const { sport_id } = req.query;

        if(!user_id) generateError('El id del usuario es requerido', 400);

        const events = await getEventsByUserService(user_id);

        const eventsWithData = await Promise.all(
            events.map(async (userEvent) => {
                const event = await getEventById(userEvent.event_id)
                let base = { owner: userEvent, ...event }
                return base;
            })
        );

        res.status(200).json({
            status: 200,
            message: 'Eventos del usuario encontrados correctamente',
            data: eventsWithData
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}

export const getEventByIdController = async (req, res, next) => {
    try {
        const { event_id } = req.params;

        if (!event_id) generateError('El id del evento es requerido', 400);

        const event = await getEventById(event_id);

        const teams = await getTeamsEventByIdService(event.id);
        const owner = await getUserEventByIdService(event.id);
        const results = await getResultsByEventIdService(event.id);

        let eventWithData = { ...event, teams, owner };

        if (event.event_type === 'tournament') {
            const tournament = await getTournament(event.id);
            eventWithData.tournament = tournament;
        } else if (event.event_type === 'league') {
            const league = await getLeagueById(event.id);
            eventWithData.league = league;
        }

        if (results && results.length > 0) {
            eventWithData.results = results;
        }else{
            eventWithData.results = [];
        }

        res.status(200).json({
            status: 200,
            message: 'Evento obtenido correctamente',
            data: eventWithData,
        });
    } catch (error) {
        console.log(error);
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
            const validatedTournament = await updateTournamentSchema.validateAsync(req.body, { stripUnknown: true });
            await updateTournament(event_id, validatedTournament);
        } else if (event.event_type === 'league') {
            const validateLeague = await await updateLeagueSchema.validateAsync(req.body, { stripUnknown: true });
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
