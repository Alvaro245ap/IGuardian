import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import teams from './routes/teams.js';
import people from './routes/people.js';
import shifts from './routes/shifts.js';
import scheduling from './routes/scheduling.js';
import health from './routes/health.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/teams', teams);
app.use('/api/teams/:teamId/people', (req,res,next)=>people(req,res,next));
app.use('/api/teams/:teamId/shifts', (req,res,next)=>shifts(req,res,next));
app.use('/api/teams/:teamId/scheduling', (req,res,next)=>scheduling(req,res,next));
app.use('/api', health);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`eguardian server on :${port}`));
