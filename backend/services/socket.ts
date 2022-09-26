import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { db } from './firebase-init';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(", ");

let io: Server;

export function startServerSocket(server: HttpServer) {
    io = new Server(server, {
        cors: {
            origin: ALLOWED_ORIGINS,
            methods: ["POST", "GET"]
        }
    });


    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        const channelRef = db.ref('current-channel');
        channelRef.on('value', (snapshot) => {
            if (socket) {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const values = Object.values(data);
                    // Emit new value only if the old currentData has been removed!
                    if (values.length === 1) {
                        socket.emit('current-channel', values[0])
                    }
                } else {
                    console.log("No data available");
                }
            }

        }, (errorObject) => {
            console.log('The read failed: ' + errorObject.name);
        });

        socket.on('disconnect', () => channelRef.off());
    });
}
