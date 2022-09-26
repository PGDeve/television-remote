import http from 'http';
import { config } from 'dotenv';

config();

import app from './services/express';
import { startServerSocket } from './services/socket';

// Socket.io requires a http client and not an express one
const server = http.createServer(app);
startServerSocket(server);

server.listen(process.env.PORT);