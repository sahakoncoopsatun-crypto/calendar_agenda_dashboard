import React from 'react';
import { CalendarDays, Users, Clock, MapPin } from 'lucide-react';
import type { CalendarEvent } from '../../types';

interface StatCardsProps {
  events: CalendarEvent[];
  detectCategory: (evt: CalendarEvent) => string;
}

export const StatCards: React.FC<StatCardsProps> = ({ events, detectCategory }) => {
  const totalEvents = events.length;
  const meetingCount = events.filter(e => (e.category || detectCategory(e)) === 'Meeting').length;
  
  let totalMinutes = 0;
  let onsiteCount = 0;

  events.forEach(evt => {
    const s = new Date(evt.start.dateTime || evt.start.date || new Date().toISOString());
    const e = evt.end ? new Date(evt.end.dateTime || evt.end.date || s.toISOString()) : s;
    const diffMs = e.getTime() - s.getTime();
    if (diffMs > 0) totalMinutes += Math.round(diffMs / (1000 * 60));

    if (evt.location && !evt.location.toLowerCase().includes('zoom') && !evt.location.toLowerCase().includes('google meet')) {
      onsiteCount++;
    }
  });

  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 no-print">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">รายการทั้งหมด</p>
          <p className="text-lg font-bold text-slate-900">{totalEvents}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">การประชุมกลุ่ม</p>
          <p className="text-lg font-bold text-slate-900">{meetingCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">เวลารวมโดยประมาณ</p>
          <p className="text-lg font-bold text-slate-900">{totalHours} ชม.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">การลงพื้นที่ / นอกสถานที่</p>
          <p className="text-lg font-bold text-slate-900">{onsiteCount}</p>
        </div>
      </div>
    </div>
  );
};
