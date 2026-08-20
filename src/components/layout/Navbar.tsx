import React from 'react';
import { CalendarRange, Settings, Plus, Download, Printer } from 'lucide-react';
import type { AppMode } from '../../types';

interface NavbarProps {
  mode: AppMode;
  onOpenSettings: () => void;
  onOpenAddEvent: () => void;
  onExportCSV: () => void;
  isPublicView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onOpenSettings, onOpenAddEvent, onExportCSV, isPublicView = false }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-3 sm:py-0 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="p-2.5 bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">ระบบรายงานกำหนดการ</h1>
              <p className="text-xs text-slate-500">Google Calendar Agenda & Schedule Report</p>
            </div>
          </div>

          {/* Mode Toggle & Configuration Button */}
          <div className="flex flex-wrap items-center gap-2 sm:space-x-3 justify-end w-full sm:w-auto">
            {/* Data Mode Badge (Hidden in Public View) */}
            {!isPublicView && (
              mode === 'DEMO' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  โหมดทดสอบ (Demo)
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  โหมด Google API
                </span>
              )
            )}

            {/* Public View Badge */}
            {isPublicView && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-500"></span>
                โหมดอ่านอย่างเดียว (Public View)
              </span>
            )}

            {/* Settings Modal Button */}
            {!isPublicView && (
              <button onClick={onOpenSettings} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                ตั้งค่าระบบ
              </button>
            )}

            {/* Add Event Button */}
            {!isPublicView && (
              <button onClick={onOpenAddEvent} className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm shadow-brand-500/20">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                เพิ่มกำหนดการ
              </button>
            )}

            {/* Export Report Button */}
            <button onClick={onExportCSV} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shadow-sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              ส่งออก CSV
            </button>

            <button onClick={() => window.print()} className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              พิมพ์รายงาน
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
