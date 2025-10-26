export type Candidate = {
  id: string;
  role: string;
  weeklyHoursCap: number;
  assignedHours: number;
  certifications: Set<string>;
  unavailable: { start: Date; end: Date }[];
};
