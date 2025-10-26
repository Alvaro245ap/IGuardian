import { prisma } from '../db/client.js';
import { scoreCandidate } from './score.js';

export async function assignOpenShifts(teamId: string, options?: { onlyShiftIds?: string[] }) {
  const shifts = await prisma.shift.findMany({
    where: { teamId, ...(options?.onlyShiftIds ? { id: { in: options.onlyShiftIds } } : {}) },
    include: { assignees: true }
  });

  const people = await prisma.person.findMany({ where: { teamId } });
  const events = await prisma.event.findMany({ where: { person: { teamId } }, include: { shift: true } });
  const sick = await prisma.sickReport.findMany({ where: { person: { teamId } } });

  const hoursByPerson = new Map<string, number>();
  for (const e of events) {
    const h = (e.shift.end.getTime() - e.shift.start.getTime()) / 3_600_000;
    hoursByPerson.set(e.personId, (hoursByPerson.get(e.personId) || 0) + h);
  }

  const cands = people.map(p => ({
    id: p.id,
    role: p.role,
    weeklyHoursCap: p.weeklyHoursCap,
    certifications: new Set(p.certifications.split(',').map(s=>s.trim()).filter(Boolean)),
    assignedHours: hoursByPerson.get(p.id) || 0,
    unavailable: sick
      .filter(s => s.personId === p.id)
      .map(s => ({ start: s.start, end: s.end }))
  }));

  const created: string[] = [];
  for (const shift of shifts) {
    const need = shift.required - shift.assignees.length;
    if (need <= 0) continue;

    const reqCerts: string[] = [];
    const pool = cands.filter(c => {
      const overlap = c.unavailable.some(u => !(u.end <= shift.start || u.start >= shift.end));
      if (overlap) return false;
      const h = (shift.end.getTime() - shift.start.getTime()) / 3_600_000;
      return c.assignedHours + h <= c.weeklyHoursCap && (c.role === shift.role);
    });

    pool.sort((a,b)=> scoreCandidate(b, shift.role, reqCerts) - scoreCandidate(a, shift.role, reqCerts));

    for (let i=0; i<need && i<pool.length; i++) {
      const p = pool[i];
      await prisma.event.create({ data: { personId: p.id, shiftId: shift.id } });
      const h = (shift.end.getTime() - shift.start.getTime()) / 3_600_000;
      p.assignedHours += h;
      created.push(shift.id);
    }
  }

  if (created.length) {
    await prisma.audit.create({ data: { teamId, message: `Auto-assigned ${created.length} shift(s)` } });
  }
  return created.length;
}
