import { Router } from 'express';
import { prisma } from '../db/client.js';
const r = Router({ mergeParams: true });

r.get('/', async (req, res) => {
  const people = await prisma.person.findMany({ where: { teamId: req.params.teamId }});
  res.json(people);
});

r.post('/', async (req, res) => {
  const p = await prisma.person.create({ data: { ...req.body, teamId: req.params.teamId }});
  res.json(p);
});

r.post('/:personId/sick', async (req, res) => {
  const { start, end, note } = req.body;
  const report = await prisma.sickReport.create({
    data: { personId: req.params.personId, start: new Date(start), end: new Date(end), note }
  });
  res.json(report);
});

export default r;
