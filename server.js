import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Update this after getting your Vercel deployment URL
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://aspitalks-livekit.vercel.app',
  'https://aspitalks-livekit-git-master-karthiks-projects-b3a1f53f.vercel.app',
  'https://aspitalks-livekit-lp2lriv8u-karthiks-projects-b3a1f53f.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const apiKey = process.env.LIVEKIT_API_KEY || 'APIK3yxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'APISECRETxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

app.get('/get-token', (req, res) => {
  const roomName = req.query.room;
  const participantName = req.query.participant;

  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'Missing room name or participant name' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });

    const token = at.toJwt();
    res.send(token);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
});