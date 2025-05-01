import { where } from 'sequelize';
import { Result } from '../../models/result.js';
import { generateError } from '../../utils/generateError.js';

export const createResultsService = async (resultsArray) => {
    try {
        const results = await Result.bulkCreate(resultsArray, { validate: true });

        if(!results){
            generateError('Error al crear los partidos', 500);
        }

        return true;
    } catch (error) {
        throw error;
    }
};

export const getResultsByEventIdService = async (event_id) => {
    try {
        const results = await Result.findAll({
            where: { event_id: event_id}
        })

        if(!results){
            generateError('Error al crear los partidos', 500);
        }

        const data = await Promise.all(
            results.map(async (currentResult) => {
                const result = await currentEvent.toJSON();
                return result;
            })
        );

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateResultService = async (result_id, data) => {
    try{
        const result = await Result.findByPk(result_id);

        if(!result){
            generateError('Error al actualizar el resultado', 500);
        }

       await result.update(data);

        return true;
    }catch(error){
        throw error;
    }
}