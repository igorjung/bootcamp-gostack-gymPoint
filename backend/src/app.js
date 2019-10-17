import express from 'express';
import routes from './routes';

import './database';

const server = express();

server.use(express.json());

server.use(routes);

export default server;
