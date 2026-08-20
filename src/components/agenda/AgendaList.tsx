import React from 'react';
import type { CalendarEvent, ViewMode } from '../../types';
import { MapPin, Users, CalendarX, Edit, Trash2 } from 'lucide-react';

interface AgendaListProps {
  events: CalendarEvent[];
  viewMode: ViewMode;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  detectCategory: (evt: CalendarEvent) => string;
}

export const AgendaList: React.FC<AgendaListProps> = ({ events, viewMode, isLoading, onEdit, onDelete, detectCategory }) => {
  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-brand-600 mb-3"></div>
        <p className="text-xs text-slate-500">กำลังเชื่อมต่อและดึงข้อมูลกำหนดการ...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 text-center px-4">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <CalendarX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">ไม่พบรายการกำหนดการในช่วงเวลานี้</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">ลองเปลี่ยนช่วงเวลาที่ต้องการค้นหา หรือตรวจสอบตัวกรองและข้อความค้นหาของคุณอีกครั้ง</p>
      </div>
    );
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Meeting':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">ประชุม</span>;
      case 'Workshop':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-md">อบรม/สัมมนา</span>;
      case 'Personal':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">ส่วนตัว</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">งานทั่วไป</span>;
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return 'All Day';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (viewMode === 'compact') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">วัน / เวลา</th>
              <th className="py-3 px-4">ชื่องาน / กำหนดการ</th>
              <th className="py-3 px-4">หมวดหมู่</th>
              <th className="py-3 px-4">สถานที่</th>
              <th className="py-3 px-4">ผู้เข้าร่วม</th>
              <th className="py-3 px-4 text-center no-print">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {events.map(evt => (
              <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900">
                  {formatDate(evt.start.dateTime || evt.start.date)}<br/>
                  <span className="text-slate-500 font-normal">{formatTime(evt.start.dateTime)} - {formatTime(evt.end?.dateTime)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">{evt.summary || '(ไม่มีชื่อ)'}</div>
                  {evt.description && <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{evt.description}</div>}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getCategoryBadge(evt.category || detectCategory(evt))}
                </td>
                <td className="py-3 px-4">
                  {evt.location ? (
                    <div className="flex items-start max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  ) : '-'}
                </td>
                <td className="py-3 px-4">
                  {evt.attendees && evt.attendees.length > 0 ? (
                    <div className="flex items-center text-slate-600">
                      <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {evt.attendees.length} คน
                    </div>
                  ) : '-'}
                </td>
                <td className="py-3 px-4 text-center no-print">
                  <div className="flex justify-center space-x-1">
                    <button onClick={() => onEdit(evt.id)} className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(evt.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Detailed View (Grouped by Date)
  const groupedEvents = events.reduce((acc, evt) => {
    const dateStr = evt.start.dateTime || evt.start.date || '';
    const dateKey = formatDate(dateStr);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(evt);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  return (
    <div className="divide-y divide-slate-100">
      {Object.entries(groupedEvents).map(([dateLabel, dayEvents]) => (
        <div key={dateLabel} className="p-4 sm:p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
            {dateLabel}
          </h3>
          <div className="space-y-4">
            {dayEvents.map(evt => (
              <div key={evt.id} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-slate-100 bg-white hover:border-brand-200 hover:shadow-md transition-all shadow-sm">
                
                {/* Time Column */}
                <div className="sm:w-32 shrink-0 flex sm:flex-col items-center sm:items-start space-x-2 sm:space-x-0">
                  <div className="font-bold text-slate-800 text-sm">
                    {formatTime(evt.start.dateTime)}
                  </div>
                  <div className="text-xs text-slate-400 sm:mt-0.5 flex-1 sm:flex-none text-right sm:text-left">
                    ถึง {formatTime(evt.end?.dateTime)}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                      {evt.summary || '(ไม่มีชื่องาน)'}
                    </h4>
                    {getCategoryBadge(evt.category || detectCategory(evt))}
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {evt.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-500">
                    {evt.location && (
                      <div className="flex items-center text-slate-700 bg-slate-100/50 px-2 py-1 rounded-md">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        <span className="truncate max-w-[200px]">{evt.location}</span>
                      </div>
                    )}
                    {evt.attendees && evt.attendees.length > 0 && (
                      <div className="flex items-center text-slate-600">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        ผู้เข้าร่วม {evt.attendees.length} คน
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-start mt-2 sm:mt-0 no-print border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                  <button onClick={() => onEdit(evt.id)} className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-md transition-colors flex items-center">
                    <Edit className="w-3 h-3 mr-1" /> แก้ไข
                  </button>
                  <button onClick={() => onDelete(evt.id)} className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-md transition-colors flex items-center">
                    <Trash2 className="w-3 h-3 mr-1" /> ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
