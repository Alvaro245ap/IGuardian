import { Router } from 'express';
import { prisma } from '../db/client.js';
const r = Router({ mergeParams: true });

r.get('/', async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const shifts = await prisma.shift.findMany({
    where: {
      teamId: req.params.teamId,
      ...(from && to ? { start: { gte: new Date(String(from)) }, end: { lte: new Date(String(to)) } } : {})
    },
    include: { assignees: true }
  });
  res.json(shifts);
});

r.post('/', async (req, res) => {
  const s = await prisma.shift.create({ data: { ...req.body, teamId: req.params.teamId }});
  res.json(s);
});

export default r;
