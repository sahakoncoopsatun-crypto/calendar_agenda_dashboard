import React, { useState, useEffect } from 'react';
import { Key, X, Link as LinkIcon, Copy, CheckCircle2 } from 'lucide-react';
import type { AppMode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [calendarId, setCalendarId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCalendarId(localStorage.getItem('gcal_public_id') || '');
      setApiKey(localStorage.getItem('gcal_public_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gcal_public_id', calendarId);
    localStorage.setItem('gcal_public_key', apiKey);
    onClose();
  };

  const getShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('share', '1');
    url.searchParams.set('calId', calendarId);
    url.searchParams.set('key', apiKey);
    return url.toString();
  };

  const copyToClipboard = () => {
    if (!calendarId || !apiKey) {
      alert('กรุณากรอก Calendar ID และ API Key ให้ครบก่อนสร้างลิงก์แชร์ครับ');
      return;
    }
    navigator.clipboard.writeText(getShareLink());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">ตั้งค่าระบบ & แชร์ลิงก์</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {/* Toggle Demo Mode */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">เปิดใช้งาน Demo Mode</span>
              <span className="text-[11px] text-slate-500">จำลองข้อมูลและบันทึกในเครื่อง</span>
            </div>
            <input 
              type="checkbox" 
              checked={mode === 'DEMO'} 
              onChange={(e) => onModeChange(e.target.checked ? 'DEMO' : 'API')} 
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer" 
            />
          </div>

          <hr className="border-slate-100" />

          {/* Share Link Settings */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
              <LinkIcon className="w-4 h-4 mr-1.5 text-slate-500" />
              สร้างลิงก์แชร์สำหรับบุคคลภายนอก
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              กรอก Google Calendar ID และ API Key (จำกัดสิทธิ์อ่าน) เพื่อสร้างลิงก์สำหรับดูอย่างเดียว (Read-only) โดยไม่ต้องล็อกอิน
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Google Calendar ID</label>
                <input 
                  type="text" 
                  value={calendarId}
                  onChange={e => {
                    setCalendarId(e.target.value);
                    localStorage.setItem('gcal_public_id', e.target.value);
                  }}
                  placeholder="เช่น id@group.calendar.google.com" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Google API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={e => {
                    setApiKey(e.target.value);
                    localStorage.setItem('gcal_public_key', e.target.value);
                  }}
                  placeholder="AIzaSy..." 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
              </div>

              {calendarId && apiKey && (
                <div className="mt-3 p-3 bg-brand-50 rounded-xl border border-brand-100 flex items-center justify-between gap-2">
                  <div className="truncate text-xs text-brand-700 font-medium">
                    {getShareLink()}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="flex-shrink-0 flex items-center px-2.5 py-1.5 bg-white text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors text-xs font-medium shadow-sm"
                  >
                    {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {isCopied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={handleSave} className="px-4 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm">บันทึก & ปิด</button>
        </div>
      </div>
    </div>
  );
};
