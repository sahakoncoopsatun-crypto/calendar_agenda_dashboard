import { useState, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Navbar } from "./components/layout/Navbar";
import { FilterToolbar } from "./components/dashboard/FilterToolbar";
import { StatCards } from "./components/dashboard/StatCards";
import { AgendaList } from "./components/agenda/AgendaList";
import { EventModal } from "./components/modals/EventModal";
import { ConfirmDeleteModal } from "./components/modals/ConfirmDeleteModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import { useCalendarEvents } from "./hooks/useCalendarEvents";
import type { AppMode, ViewMode, CalendarEvent } from "./types";
import { ListTodo } from "lucide-react";
import { formatThaiDate } from "./utils/dateUtils";

function App() {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isPublicView = searchParams.get("share") === "1";
  const publicCalId = searchParams.get("calId") || "";
  const publicApiKey = searchParams.get("key") || "";

  const [mode, setMode] = useState<AppMode>(() => {
    if (isPublicView) return "API";
    const saved = localStorage.getItem("agenda_app_mode");
    return (saved === "API" || saved === "DEMO") ? saved : "DEMO";
  });
  const [accessToken, setAccessToken] = useState<string>("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfThisWeek = new Date(today);
  const day = today.getDay();
  const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
  endOfThisWeek.setDate(diffToMon + 6);
  endOfThisWeek.setHours(23, 59, 59, 999);

  const [startDate, setStartDate] = useState<string>(today.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>(endOfThisWeek.toISOString().split("T")[0]);
  const [activePreset, setActivePreset] = useState<string>("thisWeek");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [category, setCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const { events, isLoading, saveEvent, deleteEvent } = useCalendarEvents({
    mode,
    startDate: new Date(startDate + "T00:00:00"),
    endDate: new Date(endDate + "T23:59:59"),
    accessToken,
    isPublicView,
    publicCalId,
    publicApiKey,
  });

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      setMode("API");
    },
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  const handleModeChange = (newMode: AppMode) => {
    if (isPublicView) return;
    setMode(newMode);
    localStorage.setItem("agenda_app_mode", newMode);
    if (newMode === "API" && !accessToken) {
      login();
    }
  };

  const handlePresetChange = (preset: string) => {
    setActivePreset(preset);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    let s = new Date(d);
    let e = new Date(d);
    if (preset === "today") {
      e.setHours(23, 59, 59, 999);
    } else if (preset === "thisWeek") {
      const dow = d.getDay();
      const diff = d.getDate() - dow + (dow === 0 ? -6 : 1);
      s.setDate(diff);
      e = new Date(s);
      e.setDate(s.getDate() + 6);
      e.setHours(23, 59, 59, 999);
    } else if (preset === "next7") {
      e.setDate(d.getDate() + 7);
      e.setHours(23, 59, 59, 999);
    } else if (preset === "thisMonth") {
      s = new Date(d.getFullYear(), d.getMonth(), 1);
      e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (preset === "next30") {
      e.setDate(d.getDate() + 30);
      e.setHours(23, 59, 59, 999);
    } else if (preset === "next90") {
      e.setDate(d.getDate() + 90);
      e.setHours(23, 59, 59, 999);
    } else if (preset === "next180") {
      e.setDate(d.getDate() + 180);
      e.setHours(23, 59, 59, 999);
    } else if (preset === "next365") {
      e.setDate(d.getDate() + 365);
      e.setHours(23, 59, 59, 999);
    }
    setStartDate(s.toISOString().split("T")[0]);
    setEndDate(e.toISOString().split("T")[0]);
  };

  const detectCategory = (evt: CalendarEvent) => {
    const text = ((evt.summary || "") + " " + (evt.description || "")).toLowerCase();
    if (text.includes("??????") || text.includes("meeting") || text.includes("sync")) return "Meeting";
    if (text.includes("????") || text.includes("workshop") || text.includes("??????")) return "Workshop";
    if (text.includes("???????") || text.includes("personal") || text.includes("???")) return "Personal";
    return "Task";
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const q = searchKeyword.toLowerCase();
      const summary = (evt.summary || "").toLowerCase();
      const loc = (evt.location || "").toLowerCase();
      const desc = (evt.description || "").toLowerCase();
      const matchesSearch = !q || summary.includes(q) || loc.includes(q) || desc.includes(q);
      const evtCat = evt.category || detectCategory(evt);
      const matchesCategory = category === "ALL" || evtCat === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchKeyword, category]);

  const handleExportCSV = () => {
    if (filteredEvents.length === 0) {
      alert("??????????????????????? CSV");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "?????,???????,????????,??????????????,????????????,?????????????,???????????,???????,??????????\n";
    filteredEvents.forEach((evt, idx) => {
      const sDateStr = evt.start.dateTime || evt.start.date || new Date().toISOString();
      const eDateStr = evt.end?.dateTime || evt.end?.date || sDateStr;
      const row = [
        idx + 1,
        '"' + (evt.summary || "").replace(/"/g, '""') + '"',
        evt.category || detectCategory(evt),
        formatThaiDate(sDateStr, "picker"),
        new Date(sDateStr).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
        formatThaiDate(eDateStr, "picker"),
        new Date(eDateStr).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
        '"' + (evt.location || "").replace(/"/g, '""') + '"',
        '"' + (evt.description || "").replace(/"/g, '""') + '"',
      ];
      csvContent += row.join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agenda_report_" + startDate + "_to_" + endDate + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      await saveEvent(eventData);
      setIsEventModalOpen(false);
    } catch (err: any) {
      alert("??????????????????: " + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteEventId) {
      try {
        await deleteEvent(deleteEventId);
        setDeleteEventId(null);
      } catch (err: any) {
        alert("???????????: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col bg-slate-50 antialiased selection:bg-brand-500 selection:text-white">
      <Navbar
        mode={mode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddEvent={() => { setEditingEvent(null); setIsEventModalOpen(true); }}
        onExportCSV={handleExportCSV}
        isPublicView={isPublicView}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <FilterToolbar
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(d) => { setStartDate(d); setActivePreset("custom"); }}
          onEndDateChange={(d) => { setEndDate(d); setActivePreset("custom"); }}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          category={category}
          onCategoryChange={setCategory}
          onGenerateAI={() => alert("??????? AI Summary ??????????????????? Backend API (?????????????????????)")}
        />

        <StatCards events={filteredEvents} detectCategory={detectCategory} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center">
                <ListTodo className="w-5 h-5 mr-2 text-brand-600" />
                ????????????????????
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ????????????? {formatThaiDate(startDate, "short")} - {formatThaiDate(endDate, "short")} (?? {filteredEvents.length} ??????)
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium no-print">
              <button onClick={() => setViewMode("detailed")} className={"px-3 py-1 rounded-lg transition-all " + (viewMode === "detailed" ? "text-slate-800 bg-white shadow-sm" : "text-slate-600 hover:text-slate-800")}>?????????????</button>
              <button onClick={() => setViewMode("compact")} className={"px-3 py-1 rounded-lg transition-all " + (viewMode === "compact" ? "text-slate-800 bg-white shadow-sm" : "text-slate-600 hover:text-slate-800")}>?????????????</button>
            </div>
          </div>

          <AgendaList
            events={filteredEvents}
            viewMode={viewMode}
            isLoading={isLoading}
            onEdit={(id) => {
              const evt = events.find((e) => e.id === id);
              if (evt) {
                setEditingEvent(evt);
                setIsEventModalOpen(true);
              }
            }}
            onDelete={(id) => setDeleteEventId(id)}
            detectCategory={detectCategory}
            isPublicView={isPublicView}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </main>

      <footer className="mt-auto bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <p>??????????????????????????? Google Calendar Auto-Report &amp; Agenda Dashboard</p>
          <p className="mt-1 font-medium text-slate-500">????????: ???? ?????? ?. ?????????????????</p>
        </div>
      </footer>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        initialData={editingEvent}
        onSave={handleSaveEvent}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        title={events.find((e) => e.id === deleteEventId)?.summary}
        onConfirm={handleDeleteConfirm}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mode={mode}
        onModeChange={handleModeChange}
      />
    </div>
  );
}

export default App;
