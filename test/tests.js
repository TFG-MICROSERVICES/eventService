import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from '../routes/eventRoutes.js';
import teamEventRoutes from '../routes/teamEventRoutes.js';
import resultRoutes from '../routes/resultRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/event', eventRoutes);
app.use('/team-event', teamEventRoutes);
app.use('/result', resultRoutes);

// Añadir el middleware de manejo de errores
app.use((err, req, res, next) => {
    console.log("Error in test:", err);
    res.status(err.status || 500).json({
        message: err.message,
    });
});

describe('Event Endpoints', () => {
    let createdEventId;
    let createdTeamEventId;

    describe('POST /event/register', () => {
        it('Debería crear un evento correctamente', async () => {
            const eventData = {
                sport_id: 1,
                name: 'Torneo de Fútbol 2024',
                description: 'Torneo anual de fútbol',
                event_type: 'tournament',
                location: 'Campo Municipal',
                start_time: '2024-06-01T10:00:00Z',
                end_time: '2024-06-30T18:00:00Z',
                registration_start: '2024-05-01T00:00:00Z',
                registration_end: '2024-05-25T23:59:59Z',
                user_id: 1,
                elimination_type: 'single_elimination'
            };

            const response = await request(app)
                .post('/event/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(eventData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
            expect(response.body.message).to.equal('Evento creado correctamente');
            
            createdEventId = response.body.data.id;
        });

        it('Debería fallar si faltan campos obligatorios', async () => {
            const eventData = {
                name: 'Torneo de Fútbol 2024'
                // Faltan campos obligatorios
            };

            const response = await request(app)
                .post('/event/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(eventData);

            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });

    describe('GET /event', () => {
        it('Debería obtener todos los eventos correctamente', async () => {
            const response = await request(app)
                .get('/event')
                .set('x-api-key', process.env.API_GATEWAY_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('data');
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Eventos obtenidos correctamente');
            expect(response.body.data).to.be.an('array');
        });

        it('Debería obtener un evento específico por ID', async () => {
            const response = await request(app)
                .get(`/event/${createdEventId}`)
                .set('x-api-key', process.env.API_GATEWAY_KEY);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('data');
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Evento obtenido correctamente');
            expect(response.body.data).to.have.property('id', createdEventId);
        });
    });

    describe('POST /team-event', () => {
        it('Debería registrar un equipo en un evento correctamente', async () => {
            const teamEventData = {
                data: {
                    event_id: createdEventId,
                    team_id: 1,
                    team_name: 'Equipo A'
                }
            };

            const response = await request(app)
                .post('/team-event')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(teamEventData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Equipo inscrito correctamente');
        });

        it('Debería fallar si el evento no existe', async () => {
            const teamEventData = {
                data: {
                    event_id: 99999, // ID inexistente
                    team_id: 1,
                    team_name: 'Equipo A'
                }
            };

            const response = await request(app)
                .post('/team-event')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(teamEventData);

            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('message');
        });
    });

    describe('POST /result/:event_id', () => {
        it('Debería generar los enfrentamientos para un torneo correctamente', async () => {
            // Primero registramos otro equipo para tener al menos 2 equipos
            const teamEventData = {
                data: {
                    event_id: createdEventId,
                    team_id: 2,
                    team_name: 'Equipo B'
                }
            };

            await request(app)
                .post('/team-event')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(teamEventData);

            // Generamos los enfrentamientos
            const response = await request(app)
                .post(`/result/${createdEventId}`)
                .set('x-api-key', process.env.API_GATEWAY_KEY);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('data');
            expect(response.body.message).to.equal('Enfrentamientos de eliminación creados correctamente');
        });

        it('Debería fallar si no hay suficientes equipos', async () => {
            // Creamos un nuevo evento sin equipos
            const newEventData = {
                sport_id: 1,
                name: 'Torneo sin equipos',
                description: 'Torneo de prueba',
                event_type: 'tournament',
                location: 'Campo Municipal',
                start_time: '2024-06-01T10:00:00Z',
                end_time: '2024-06-30T18:00:00Z',
                registration_start: '2024-05-01T00:00:00Z',
                registration_end: '2024-05-25T23:59:59Z',
                user_id: 1,
                elimination_type: 'single_elimination'
            };

            const newEventResponse = await request(app)
                .post('/event/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(newEventData);

            const response = await request(app)
                .post(`/result/${newEventResponse.body.data.id}`)
                .set('x-api-key', process.env.API_GATEWAY_KEY);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('No hay suficientes equipos para crear enfrentamientos');
        });
    });
});
