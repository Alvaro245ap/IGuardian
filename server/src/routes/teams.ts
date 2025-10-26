import { Router } from 'express';
import { prisma } from '../db/client.js';
const r = Router();

r.get('/', async (_req, res) => {
  res.json(await prisma.team.findMany());
});

r.post('/', async (req, res) => {
  const team = await prisma.team.create({ data: { name: req.body.name, timezone: req.body.timezone ?? 'Europe/Madrid' }});
  res.json(team);
});

r.get('/:id/audit', async (req, res) => {
  const logs = await prisma.audit.findMany({ where: { teamId: req.params.id }, orderBy: { createdAt: 'desc' }});
  res.json(logs);
});

export default r;
