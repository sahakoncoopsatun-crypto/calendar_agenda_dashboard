import React, { useState, useEffect } from 'react';
import { CalendarPlus, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';
import { formatThaiDate, formatThaiTime } from '../../utils/dateUtils';
import type { CalendarEvent } from '../../types';

registerLocale('th', th);

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  initialData?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
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
        
        setStart(sDate);
        setEnd(eDate);
        setLocation(initialData.location || '');
        setDescription(initialData.description || '');
        setAttendees(initialData.attendees ? initialData.attendees.map(a => a.email).join(', ') : '');
      } else {
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        setSummary('');
        setCategory('Meeting');
        setStart(now);
        setEnd(nextHour);
        setLocation('');
        setDescription('');
        setAttendees('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start >= end) {
      alert('วัน-เวลาเริ่มต้นต้องมาก่อนวัน-เวลาสิ้นสุด');
      return;
    }
    const attendeeList = attendees ? attendees.split(',').map(email => ({ email: email.trim() })).filter(a => a.email) : [];
    
    onSave({
      id: initialData?.id,
      summary,
      category,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
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
              <div className="relative">
                <DatePicker
                  selected={start}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setStart(date);
                      if (date >= end) {
                        setEnd(new Date(date.getTime() + 60 * 60 * 1000));
                      }
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="P p"
                  locale="th"
                  customInput={
                    <input 
                      value={`${formatThaiDate(start, 'picker')} ${formatThaiTime(start)}`}
                      onChange={() => {}}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800 bg-white cursor-pointer"
                    />
                  }
                  renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div className="flex items-center justify-between px-2 py-1">
                      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="text-sm font-semibold text-slate-800">
                        {date.toLocaleString('th-TH', { month: 'long' })} {date.getFullYear() + 543}
                      </span>
                      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  )}
                />
                <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">วัน-เวลา สิ้นสุด <span className="text-red-500">*</span></label>
              <div className="relative">
                <DatePicker
                  selected={end}
                  onChange={(date: Date | null) => date && setEnd(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="P p"
                  locale="th"
                  minDate={start}
                  customInput={
                    <input 
                      value={`${formatThaiDate(end, 'picker')} ${formatThaiTime(end)}`}
                      onChange={() => {}}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800 bg-white cursor-pointer"
                    />
                  }
                  renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div className="flex items-center justify-between px-2 py-1">
                      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="text-sm font-semibold text-slate-800">
                        {date.toLocaleString('th-TH', { month: 'long' })} {date.getFullYear() + 543}
                      </span>
                      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  )}
                />
                <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
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
