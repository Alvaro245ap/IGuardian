export type Team = { id: string; name: string; timezone: string };
export type Person = { id: string; displayName: string; email: string; role: string; weeklyHoursCap: number };
export type Shift = { id: string; start: string; end: string; role: string; required: number; assignees: { id: string; personId: string }[] };
