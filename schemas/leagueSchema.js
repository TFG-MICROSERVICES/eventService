import Joi from 'joi';

export const leagueSchema = Joi.object({
    event_id: Joi.number().required().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
        'any.required': 'El ID del evento es requerido',
    }),

    teams_max: Joi.number().integer().min(2).required().messages({
        'number.base': 'El número máximo de equipos debe ser un número',
        'number.integer': 'El número máximo de equipos debe ser un número entero',
        'number.min': 'El número máximo de equipos debe ser al menos 2',
        'any.required': 'El número máximo de equipos es requerido',
    }),

    round_robin: Joi.boolean().required().messages({
        'boolean.base': 'El campo round_robin debe ser un valor booleano',
        'any.required': 'Debe especificar si el torneo es ida y vuelta',
    }),
});

export const updateLeagueSchema = Joi.object({
    event_id: Joi.number().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
    }),

    teams_max: Joi.number().integer().min(2).messages({
        'number.base': 'El número máximo de equipos debe ser un número',
        'number.integer': 'El número máximo de equipos debe ser un número entero',
        'number.min': 'El número máximo de equipos debe ser al menos 2',
    }),

    round_robin: Joi.boolean().messages({
        'boolean.base': 'El campo round_robin debe ser un valor booleano',
    }),
})
    .min(1)
    .messages({
        'object.min': 'Debe proporcionar al menos un campo para actualizar',
    });
