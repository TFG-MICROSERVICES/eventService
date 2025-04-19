import Joi from 'joi';

export const schemaTeamEvent = Joi.object({
    event_id: Joi.number().required().messages({
        'any.required': 'El ID del evento es requerido',
    }),
    team_id: Joi.number().required().messages({
        'any.required': 'El ID del evento es requerido',
    }),
});
