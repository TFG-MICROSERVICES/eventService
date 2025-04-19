import { Event } from '../../models/event.js';
import { generateError } from '../../utils/generateError.js';

export const createEvent = async (eventData) => {
    try {
        const event = await Event.create(eventData);

        if (!event) {
            generateError('Error al crear el evento', 500);
        }

        return event;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const checkExistsNameEvent = async (name) => {
    try {
        const event = await Event.findOne({
            where: { name: name },
        });

        if (event) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getEvents = async (sport_id) => {
    try {
        let events;
        console.log(sport_id);
        if (sport_id) {
            events = await Event.findAll({
                where: { sport_id: sport_id },
            });
        } else {
            events = await Event.findAll();
        }

        const data = await Promise.all(
            events.map(async (currentEvent) => {
                const event = await currentEvent.toJSON();
                return event;
            })
        );

        return data;
    } catch (error) {
        throw error;
    }
};
export const getEventById = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);

        if (!event) generateError('Event not found', 404);

        const data = await event.toJSON();

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) generateError('Event not found', 404);
        await event.update(eventData);
        return event;
    } catch (error) {
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) generateError('Event not found', 404);
        await event.destroy();
        return event;
    } catch (error) {
        throw error;
    }
};
