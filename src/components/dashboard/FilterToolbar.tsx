import React from 'react';
import { Clock, Sparkles, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';
import { formatThaiDate } from '../../utils/dateUtils';

registerLocale('th', th);

interface FilterToolbarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPresetChange: (preset: string) => void;
  activePreset: string;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  onGenerateAI: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPresetChange,
  activePreset,
  searchKeyword,
  onSearchChange,
  category,
  onCategoryChange,
  onGenerateAI
}) => {
  const presets = [
    { id: 'today', label: 'วันนี้' },
    { id: 'thisWeek', label: 'สัปดาห์นี้' },
    { id: 'next7', label: '7 วันข้างหน้า' },
    { id: 'thisMonth', label: 'เดือนนี้' },
    { id: 'next30', label: '30 วันข้างหน้า' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 no-print">
      {/* Quick Range Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> ช่วงเวลา:
          </span>
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                activePreset === preset.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/20'
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* AI Summary Button */}
        <button onClick={onGenerateAI} className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all shadow-sm">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
          สร้างสรุปภาพรวมด้วย AI
        </button>
      </div>

      {/* Custom Date Inputs & Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Start Date */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">วันที่เริ่มต้น</label>
          <div className="relative">
            <DatePicker
              selected={new Date(startDate + 'T00:00:00')}
              onChange={(date: Date | null) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  onStartDateChange(`${y}-${m}-${d}`);
                }
              }}
              locale="th"
              customInput={
                <input 
                  value={formatThaiDate(startDate, 'picker')} 
                  onChange={() => {}} // dummy onChange for customInput
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 bg-slate-50/50"
                />
              }
              renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="flex items-center justify-between px-2 py-1">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-sm font-semibold text-slate-800">
                    {date.toLocaleString('th-TH', { month: 'long' })} {date.getFullYear() + 543}
                  </span>
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* End Date */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">วันที่สิ้นสุด</label>
          <div className="relative">
            <DatePicker
              selected={new Date(endDate + 'T00:00:00')}
              onChange={(date: Date | null) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  onEndDateChange(`${y}-${m}-${d}`);
                }
              }}
              locale="th"
              minDate={new Date(startDate + 'T00:00:00')}
              customInput={
                <input 
                  value={formatThaiDate(endDate, 'picker')} 
                  onChange={() => {}} // dummy onChange
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 bg-slate-50/50"
                />
              }
              renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="flex items-center justify-between px-2 py-1">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-sm font-semibold text-slate-800">
                    {date.toLocaleString('th-TH', { month: 'long' })} {date.getFullYear() + 543}
                  </span>
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-slate-600 hover:text-brand-600"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Keyword Search */}
        <div className="lg:col-span-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">ค้นหากิจกรรม / สถานที่</label>
          <div className="relative">
            <input 
              type="text" 
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="พิมพ์ชื่องาน, สถานที่, หรือรายละเอียด..." 
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 bg-slate-50/50" 
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">หมวดหมู่</label>
          <select 
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800 bg-slate-50/50"
          >
            <option value="ALL">ทั้งหมด</option>
            <option value="Meeting">การประชุม (Meeting)</option>
            <option value="Task">งานเดี่ยว / Task</option>
            <option value="Workshop">สัมมนา / อบรม</option>
            <option value="Personal">ส่วนตัว / นัดหมาย</option>
          </select>
        </div>
      </div>
    </div>
  );
};
