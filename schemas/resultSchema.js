import Joi from 'joi';

export const resultSchema = Joi.object({
    event_id: Joi.number().integer().required().messages({
        'number.base': 'El ID del evento debe ser un número',
        'any.required': 'El ID del evento es requerido',
    }),

    home_team_id: Joi.number().integer().required().messages({
        'number.base': 'El ID del equipo local debe ser un número',
        'any.required': 'El ID del equipo local es requerido',
    }),

    away_team_id: Joi.number().integer().required().messages({
        'number.base': 'El ID del equipo visitante debe ser un número',
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

    round: Joi.number().integer().min(1).allow(null).messages({
        'number.base': 'La jornada debe ser un número',
        'number.integer': 'La jornada debe ser un número entero',
        'number.min': 'La jornada debe ser mayor o igual a 1',
    }),

    playedAt: Joi.date().iso().allow(null).messages({
        'date.base': 'La fecha debe ser una fecha válida',
        'date.format': 'La fecha debe tener formato ISO',
    }),
}).custom((value, helpers) => {
    if (value.home_team_id === value.away_team_id) {
        return helpers.error('custom.sameTeam', {
            message: 'El equipo local y visitante no pueden ser el mismo',
        });
    }
    return value;
});

export const updateResultSchema = Joi.object({
    event_id: Joi.number().integer().allow("", null).messages({
        'number.base': 'El ID del evento debe ser un número',
        'any.required': 'El ID del evento es requerido',
    }),

    home_team_id: Joi.number().integer().allow("", null).messages({
        'number.base': 'El ID del equipo local debe ser un número',
        'any.required': 'El ID del equipo local es requerido',
    }),

    away_team_id: Joi.number().integer().allow("", null).messages({
        'number.base': 'El ID del equipo visitante debe ser un número',
        'any.required': 'El ID del equipo visitante es requerido',
    }),

    score_home: Joi.number().integer().min(0).allow("", null).messages({
        'number.base': 'El marcador del equipo local debe ser un número',
        'number.integer': 'El marcador del equipo local debe ser un número entero',
        'number.min': 'El marcador del equipo local no puede ser negativo',
    }),

    score_away: Joi.number().integer().min(0).allow("", null).messages({
        'number.base': 'El marcador del equipo visitante debe ser un número',
        'number.integer': 'El marcador del equipo visitante debe ser un número entero',
        'number.min': 'El marcador del equipo visitante no puede ser negativo',
    }),

    round: Joi.number().integer().min(1).allow("", null).messages({
        'number.base': 'La jornada debe ser un número',
        'number.integer': 'La jornada debe ser un número entero',
        'number.min': 'La jornada debe ser mayor o igual a 1',
    }),

    playedAt: Joi.date().iso().allow(null).messages({
        'date.base': 'La fecha debe ser una fecha válida',
        'date.format': 'La fecha debe tener formato ISO',
    }),
}).custom((value, helpers) => {
    if (value.home_team_id === value.away_team_id) {
        return helpers.error('custom.sameTeam', {
            message: 'El equipo local y visitante no pueden ser el mismo',
        });
    }
    return value;
});
