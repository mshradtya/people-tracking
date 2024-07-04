import http from 'http';
import express from 'express';
import './config/logging';
import 'reflect-metadata';
import mongoose from 'mongoose';

import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER_HOSTNAME, SERVER_PORT, mongo } from './config/config';
import { defineRoutes } from './modules/routes';
import MainController from './controllers/main';
import { declareHandler } from './middleware/declareHandler';
import BookController from './controllers/book';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
    logging.info('-------------------------------------------------------------');
    logging.info('Initializing API');
    logging.info('-------------------------------------------------------------');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.info('-------------------------------------------------------------');
    logging.info('Connect to MongoDB');
    logging.info('-------------------------------------------------------------');
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
        logging.log('-------------------------------------------------------------');
        logging.log('Connected to MongoDB', connection.version);
        logging.log('-------------------------------------------------------------');
    } catch (error) {
        logging.log('-------------------------------------------------------------');
        logging.log('Unable to Connect to MongoDB');
        logging.error(error);
        logging.log('-------------------------------------------------------------');
    }

    logging.info('-------------------------------------------------------------');
    logging.info('Logging & Configuration');
    logging.info('-------------------------------------------------------------');
    application.use(declareHandler);
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.info('-------------------------------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('-------------------------------------------------------------');
    defineRoutes([MainController, BookController], application);

    logging.info('-------------------------------------------------------------');
    logging.info('Define Routing Error');
    logging.info('-------------------------------------------------------------');
    application.use(routeNotFound);

    logging.info('-------------------------------------------------------------');
    logging.info('Start Server');
    logging.info('-------------------------------------------------------------');
    httpServer = http.createServer(application);
    httpServer.listen(SERVER_PORT, () => {
        logging.info('-------------------------------------------------------------');
        logging.info('Server Started: ' + SERVER_HOSTNAME + ':' + SERVER_PORT);
        logging.info('-------------------------------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
