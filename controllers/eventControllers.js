import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../db/services/eventsServices.js';
import { eventSchema, updateEventSchema } from '../schemas/eventSchema.js';
import { generateError } from '../utils/generateError.js';

export const createEventController = async (req, res, next) => {
    try {
        const validatedEvent = await eventSchema.validateAsync(req.body);
        const event = await createEvent(validatedEvent);
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

        res.status(200).json({
            status: 200,
            message: 'Eventos obtenidos correctamente',
            data: events,
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

        res.status(200).json({
            status: 200,
            message: 'Evento obtenido correctamente',
            data: event,
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
