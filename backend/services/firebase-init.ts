import admin, { ServiceAccount } from "firebase-admin";

import serviceAccount from "../config/firebase-adminsdk.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

export {
    db
};

