import { generateError } from '../utils/generateError.js';
import dotenv from 'dotenv';

dotenv.config();

export function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_GATEWAY_KEY) {
        return generateError('Acceso denegado', 403);
    }
    next();
}
