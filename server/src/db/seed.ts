import { prisma } from './client.js';

async function main() {
  const team = await prisma.team.create({ data: { name: 'General Surgery' } });

  const people = await prisma.$transaction([
    prisma.person.create({ data: {
      displayName: 'Dr. Ana Ruiz', email:'ana@hospital.test', role:'Surgeon',
      certifications:'ATLS,Boarded', teamId: team.id, weeklyHoursCap: 48
    }}),
    prisma.person.create({ data: {
      displayName: 'Dr. Luis Pérez', email:'luis@hospital.test', role:'Surgeon',
      certifications:'ATLS', teamId: team.id, weeklyHoursCap: 48
    }}),
    prisma.person.create({ data: {
      displayName: 'Dr. Marta Gil', email:'marta@hospital.test', role:'Anesthetist',
      certifications:'ASA', teamId: team.id, weeklyHoursCap: 48
    }})
  ]);

  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay(); // 0=Sun
  monday.setDate(monday.getDate() - ((day + 6) % 7)); // Monday
  const shifts = [];
  for (let d = 0; d < 7; d++) {
    const base = new Date(monday); base.setDate(monday.getDate() + d);
    const s1 = new Date(base); s1.setHours(7,0,0,0);
    const e1 = new Date(base); e1.setHours(15,0,0,0);
    shifts.push(await prisma.shift.create({ data: { teamId: team.id, start: s1, end: e1, role: 'Surgeon', required: 1 }}));
    shifts.push(await prisma.shift.create({ data: { teamId: team.id, start: s1, end: e1, role: 'Anesthetist', required: 1 }}));
  }

  console.log(`Seeded team ${team.name}, people: ${people.length}, shifts: ${shifts.length}`);
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
