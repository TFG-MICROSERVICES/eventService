import Joi from 'joi';

const resultSchema = Joi.object({
    event_id: Joi.string().required().messages({
        'string.empty': 'El ID del evento no puede estar vacío',
        'any.required': 'El ID del evento es requerido',
    }),

    home_team_id: Joi.string().max(255).required().messages({
        'string.empty': 'El ID del equipo local no puede estar vacío',
        'string.max': 'El ID del equipo local no puede exceder los 255 caracteres',
        'any.required': 'El ID del equipo local es requerido',
    }),

    away_team_id: Joi.string().max(255).required().messages({
        'string.empty': 'El ID del equipo visitante no puede estar vacío',
        'string.max': 'El ID del equipo visitante no puede exceder los 255 caracteres',
        'any.required': 'El ID del equipo visitante es requerido',
    }),

    score_home: Joi.number().integer().min(0).allow(null).messages({
        'number.base': 'El marcador del equipo local debe ser un número',
        'number.integer': 'El marcador del equipo local debe ser un número entero',
        'number.min': 'El marcador del equipo local no puede ser negativo',
    }),

    score_away: Joi.number().integer().min(0).allow(null).messages({
        'number.base': 'El marcador del equipo visitante debe ser un número',
        'number.integer': 'El marcador del equipo visitante debe ser un número entero',
        'number.min': 'El marcador del equipo visitante no puede ser negativo',
    }),
}).custom((value, helpers) => {
    if (value.home_team_id === value.away_team_id) {
        return helpers.error('custom.sameTeam', {
            message: 'El equipo local y visitante no pueden ser el mismo',
        });
    }
    return value;
});

module.exports = resultSchema;
