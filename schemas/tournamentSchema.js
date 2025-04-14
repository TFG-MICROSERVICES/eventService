import Joi from 'joi';

const tournamentSchema = Joi.object({
    event_id: Joi.string().required().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
        'any.required': 'El ID del evento es requerido',
    }),

    elimination_type: Joi.string().valid('single_elimination', 'double_elimination', 'group_stage').required().messages({
        'string.empty': 'El tipo de eliminación no puede estar vacío',
        'any.only': 'El tipo de eliminación debe ser single_elimination, double_elimination o group_stage',
        'any.required': 'El tipo de eliminación es requerido',
    }),

    team_for_group: Joi.number()
        .integer()
        .min(2)
        .allow(null)
        .when('elimination_type', {
            is: 'group_stage',
            then: Joi.required(),
        })
        .messages({
            'number.base': 'El número de equipos por grupo debe ser un número',
            'number.integer': 'El número de equipos por grupo debe ser un número entero',
            'number.min': 'El número de equipos por grupo debe ser al menos 2',
            'any.required': 'El número de equipos por grupo es requerido cuando el tipo es group_stage',
        }),

    number_of_teams: Joi.number().integer().min(2).required().messages({
        'number.base': 'El número de equipos debe ser un número',
        'number.integer': 'El número de equipos debe ser un número entero',
        'number.min': 'El número de equipos debe ser al menos 2',
        'any.required': 'El número de equipos es requerido',
    }),
});

module.exports = tournamentSchema;
