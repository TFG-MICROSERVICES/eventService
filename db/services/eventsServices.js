import { Event } from '../../models/event.js';
import { generateError } from '../../utils/generateError.js';

export const createEvent = async (eventData) => {
    try {
        const event = await Event.create(eventData);
        return event;
    } catch (error) {
        generateError(error);
    }
};

export const getEvents = async () => {
    try {
        const events = await Event.findAll();
        return events;
    } catch (error) {
        generateError(error);
    }
};
export const getEventById = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) generateError('Event not found', 404);
        return event;
    } catch (error) {
        generateError(error);
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) generateError('Event not found', 404);
        await event.update(eventData);
        return event;
    } catch (error) {
        generateError(error);
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) generateError('Event not found', 404);
        await event.destroy();
        return event;
    } catch (error) {
        generateError(error);
    }
};
