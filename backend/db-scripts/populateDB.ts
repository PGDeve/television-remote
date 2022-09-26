import { config } from 'dotenv';
config();

import { db } from '../services/firebase-init';

import json from './channels.json';

const channelsRef = db.ref('channels');

channelsRef.remove();

json.forEach(
    async (channel, id) => {
        const { key } = await channelsRef.push(channel);
        if (id === 0) {
            const oldCurrentChannelRef = db.ref(`current-channel`);
            await oldCurrentChannelRef.remove();

            const newCurrentChannelRef = db.ref(`current-channel/${key}`);
            await newCurrentChannelRef.set(channel);
        }
    }
);