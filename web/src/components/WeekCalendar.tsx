"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Shift, Person } from "@/lib/types";

export default function WeekCalendar({ shifts, people }: { shifts: Shift[]; people: Person[] }) {
  const events = shifts.flatMap(s => s.assignees.map(a => {
    const p = people.find(pp => pp.id === a.personId);
    return { id: `${s.id}-${a.id}`, title: `${s.role} — ${p?.displayName ?? "Unassigned"}`, start: s.start, end: s.end };
  }));

  return (
    <div className="rounded-xl border bg-white p-2">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,dayGridDay' }}
        height="auto"
        events={events}
      />
    </div>
  );
}
