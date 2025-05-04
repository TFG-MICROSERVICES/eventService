import Joi from 'joi';

export const tournamentSchema = Joi.object({
    event_id: Joi.number().required().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
        'any.required': 'El ID del evento es requerido',
    }),
    elimination_type: Joi.string().valid('single_elimination', 'double_elimination').required().messages({
        'string.empty': 'El tipo de eliminación no puede estar vacío',
        'any.only': 'El tipo de eliminación debe ser un partido o dos paridos',
        'any.required': 'El tipo de eliminación es requerido',
    }),
    number_of_teams: Joi.number().integer().min(2).required().messages({
        'number.base': 'El número de equipos debe ser un número',
        'number.integer': 'El número de equipos debe ser un número entero',
        'number.min': 'El número de equipos debe ser al menos 2',
        'any.required': 'El número de equipos es requerido',
    }),
});

export const updateTournamentSchema = Joi.object({
    event_id: Joi.number().required().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
    }),
    elimination_type: Joi.string().valid('single_elimination', 'double_elimination').messages({
        'string.empty': 'El tipo de eliminación no puede estar vacío',
        'any.only': 'El tipo de eliminación debe ser de un paridos o dos partidos',
    }),
    number_of_teams: Joi.number().integer().min(2).messages({
        'number.base': 'El número de equipos debe ser un número',
        'number.integer': 'El número de equipos debe ser un número entero',
        'number.min': 'El número de equipos debe ser al menos 2',
    }),
})
    .min(1)
    .messages({
        'object.min': 'Debe proporcionar al menos un campo para actualizar',
    });
