import React from 'react';
import { Key, X } from 'lucide-react';
import type { AppMode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">ตั้งค่าระบบ</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          สามารถเลือกใช้ <b>โหมดจำลอง (Demo Mode)</b> เพื่อทดลองใช้งาน หรือปิดเพื่อเชื่อมต่อกับ Google Calendar จริง (ต้องมี Client ID)
        </p>

        <div className="space-y-3 pt-2">
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
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm">บันทึก</button>
        </div>
      </div>
    </div>
  );
};
