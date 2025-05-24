import { generateError } from '../../utils/generateError.js';
import { UserEvent } from '../../models/userEvents.js';
import { deleteEvent } from './eventsServices.js';
import { Event } from '../../models/event.js';

export const createUserEventService = async (data) => {
    try {
        const userEvent = await UserEvent.create(data);

        if (!userEvent) {
            await deleteEvent(data.event_id);
            generateError('Error al asociar al usuario al evento');
        }

        return userEvent;
    } catch (error) {
        throw error;
    }
};

export const getUserEventByIdService = async (event_id) => {
    try {
        const userEvent = await UserEvent.findOne({
            where: { event_id: event_id },
        });

        const data = await userEvent.toJSON();

        return data;
    } catch (error) {
        throw error;
    }
};

export const getEventsByUserService = async (user_id) => {
    try {
        const events = await UserEvent.findAll({
            where: { user_id: user_id}
        });

        const data = await Promise.all(events.map(event => event.toJSON()));

        return data;
    } catch (error) {
        throw error;
    }
}
