import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs, { existsSync } from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import remoteRoutes from '../routes/remote';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(", ");

let accessLogStream: fs.WriteStream | undefined = undefined;
if (process.env.NODE_ENV !== 'production') {
  // create a write stream (in append mode)
  if (!existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdir(path.join(__dirname, 'logs'), (err) => {
      if (err) throw err;
    });
  }
  accessLogStream = fs.createWriteStream(path.join(__dirname, `logs/access${new Date().getTime()}.log`), { flags: 'a' });
}
const app = express();

// Set default http headers for security
app.use(helmet())

// Rate limiter to protect from Ddos
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter);

// Set up CORS
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET"]
  })
);

// Logging on console in dev mode and in /logs in production
app.use(morgan('combined', { stream: accessLogStream }));


// ROUTES
app.use('/remote', remoteRoutes);

app.use((req, res, next) => {
  res.sendStatus(404);
});

// Default Error handling
app.use((error: Error, req: any, res: any, next: any) => {
  if (accessLogStream) {
    const { name, message, stack } = error;
    accessLogStream.write(`${name}: ${message}\n ${stack}\n`);
  } else {
    console.error(error);
  }
  res.status(500).send(error.message);
});

export default app;