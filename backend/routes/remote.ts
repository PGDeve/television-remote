import express from 'express';
import { ChannelData, ChannelObject } from '../model/app.model';
import { db } from '../services/firebase-init';

const router = express.Router();

router.get('/nextChannel', async (req, res, next) => {
  try {
    const channelRef = db.ref('current-channel');
    const snapshot = await channelRef.get();
    if (snapshot.exists()) {
      const currentChannel: ChannelObject = snapshot.val();

      if (Object.keys(currentChannel).length > 1) {
        throw new Error("More than one element in current-channel!")
      }

      const channelListRef = db.ref('channels');
      const queryChannelList = channelListRef.orderByChild('code');
      const channelListSnapshot = await queryChannelList.get();

      if (channelListSnapshot.exists()) {
        const channelList: ChannelObject = channelListSnapshot.val();
        // Create an array of [channelId, channelData] to iterate
        const channelListArray: [string, ChannelData][] = Object.entries(channelList);

        let currentChannelId: string = "";
        let nextChannelIndex: number = 0;
        for (const id in currentChannel) {
          currentChannelId = id;
          // Look for the index of channel with id equal to currentChannel's ID
          nextChannelIndex = channelListArray.findIndex(([channelId]) => channelId === id) + 1;
          // If current channel is last loop start from beginning
          if (nextChannelIndex === channelListArray.length) nextChannelIndex = 0;
        }

        const nextChannelList = channelListArray[nextChannelIndex];

        const newCurrentChannelRef = db.ref(`current-channel/${nextChannelList[0]}`);
        await newCurrentChannelRef.set(nextChannelList[1]);

        const oldCurrentChannelRef = db.ref(`current-channel/${currentChannelId}`);
        await oldCurrentChannelRef.remove();

        res.sendStatus(200);
      } else {
        next(new Error("Error while retrieving channel list!"));
      }

    } else {
      res.status(400).json("No data available!")
    }
  } catch (error) {
    next(new Error("Error while retrieving current channel!"));
  }
});

router.get('/previousChannel', async (req, res, next) => {
  try {
    const channelRef = db.ref('current-channel');
    const snapshot = await channelRef.get();
    if (snapshot.exists()) {
      const currentChannel: ChannelObject = snapshot.val();

      if (Object.keys(currentChannel).length > 1) {
        throw new Error("More than one element in current-channel!")
      }

      const channelListRef = db.ref('channels');
      const queryChannelList = channelListRef.orderByChild('code');
      const channelListSnapshot = await queryChannelList.get();

      if (channelListSnapshot.exists()) {
        const channelList: ChannelObject = channelListSnapshot.val();
        // Create an array of [channelId, channelData] to iterate
        const channelListArray: [string, ChannelData][] = Object.entries(channelList);

        let currentChannelId: string = "";
        let previousChannelIndex: number = 0;
        for (const id in currentChannel) {
          currentChannelId = id;
          // Look for the index of channel with id equal to currentChannel's ID
          previousChannelIndex = channelListArray.findIndex(([channelId]) => channelId === id) - 1;
          // If current channel is first start from end
          if (previousChannelIndex < 0) previousChannelIndex = channelListArray.length - 1;
        }

        const previousChannelList = channelListArray[previousChannelIndex];

        const newCurrentChannelRef = db.ref(`current-channel/${previousChannelList[0]}`);
        await newCurrentChannelRef.set(previousChannelList[1]);

        const oldCurrentChannelRef = db.ref(`current-channel/${currentChannelId}`);
        await oldCurrentChannelRef.remove();

        res.sendStatus(200);
      } else {
        next(new Error("Error while retrieving channel list!"));
      }

    } else {
      res.status(400).json("No data available!")
    }
  } catch (error) {
    next(new Error("Error while retrieving current channel!"));
  }
});

export default router;