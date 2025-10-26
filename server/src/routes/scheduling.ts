import { Router } from 'express';
import { assignOpenShifts } from '../scheduler/engine.js';
const r = Router({ mergeParams: true });

r.post('/run', async (req, res) => {
  const count = await assignOpenShifts(req.params.teamId);
  res.json({ assigned: count });
});

r.post('/rebalance', async (req, res) => {
  const { shiftIds } = req.body as { shiftIds?: string[] };
  const count = await assignOpenShifts(req.params.teamId, { onlyShiftIds: shiftIds });
  res.json({ assigned: count });
});

export default r;
