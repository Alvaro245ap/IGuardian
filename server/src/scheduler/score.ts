export function scoreCandidate(
  cand: { assignedHours: number; role: string; certifications: Set<string> },
  reqRole: string,
  reqCerts: string[]
) {
  const roleScore = cand.role === reqRole ? 1 : 0;
  const certOverlap = reqCerts.filter(c => cand.certifications.has(c)).length;
  return (100 - Math.min(cand.assignedHours, 100)) + roleScore * 50 + certOverlap * 5;
}
