import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import database from './db/database.js';
import { EventEmitter } from 'events';
import eventRoutes from './routes/eventRoutes.js';
import teamEvent from './routes/teamEventRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

EventEmitter.defaultMaxListeners = 30;
app.use(express.json());
app.use(morgan('combined'));

app.use('/event', eventRoutes);
app.use('/team-event', teamEvent);
app.use('/result', resultRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Server error',
    });
});

database
    .sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
