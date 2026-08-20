import React, { useState, useEffect } from 'react';
import { CalendarPlus, X } from 'lucide-react';
import type { CalendarEvent } from '../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  initialData?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSummary(initialData.summary || '');
        setCategory(initialData.category || 'Meeting');
        
        const sDate = new Date(initialData.start.dateTime || initialData.start.date || new Date().toISOString());
        const eDate = new Date(initialData.end?.dateTime || initialData.end?.date || sDate.toISOString());
        
        setStart(formatDateTimeLocal(sDate));
        setEnd(formatDateTimeLocal(eDate));
        setLocation(initialData.location || '');
        setDescription(initialData.description || '');
        setAttendees(initialData.attendees ? initialData.attendees.map(a => a.email).join(', ') : '');
      } else {
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        setSummary('');
        setCategory('Meeting');
        setStart(formatDateTimeLocal(now));
        setEnd(formatDateTimeLocal(nextHour));
        setLocation('');
        setDescription('');
        setAttendees('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attendeeList = attendees ? attendees.split(',').map(email => ({ email: email.trim() })).filter(a => a.email) : [];
    
    onSave({
      id: initialData?.id,
      summary,
      category,
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
      location,
      description,
      attendees: attendeeList
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{initialData ? 'แก้ไขกำหนดการ' : 'เพิ่มกำหนดการใหม่'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">ชื่องาน / กิจกรรม <span className="text-red-500">*</span></label>
            <input type="text" required value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="ระบุชื่องาน หรือหัวข้อการประชุม..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">หมวดหมู่</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800 bg-white">
              <option value="Meeting">การประชุม (Meeting)</option>
              <option value="Task">งานทั่วไป / Task</option>
              <option value="Workshop">สัมมนา / อบรม (Workshop)</option>
              <option value="Personal">ส่วนตัว / นัดหมาย (Personal)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">วัน-เวลา เริ่มต้น <span className="text-red-500">*</span></label>
              <input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">วัน-เวลา สิ้นสุด <span className="text-red-500">*</span></label>
              <input type="datetime-local" required value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">สถานที่ / ลิงก์ประชุมออนไลน์</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="เช่น ห้องประชุม A1 หรือ Google Meet / Zoom..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">รายละเอียด / หมายเหตุ</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดของงาน หรือระเบียบวาระ..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800"></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">ผู้เข้าร่วม (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
            <input type="text" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="user1@company.com, user2@company.com" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800" />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">ยกเลิก</button>
            <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm">บันทึกกำหนดการ</button>
          </div>
        </form>
      </div>
    </div>
  );
};
