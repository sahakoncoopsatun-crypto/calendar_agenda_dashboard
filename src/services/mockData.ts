import type { CalendarEvent } from '../types';

export const getStoredDemoEvents = (): CalendarEvent[] => {
  const stored = localStorage.getItem('gcal_demo_events_data');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }

  const today = new Date();
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const formatIso = (date: Date, hours: number, minutes: number) => {
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const sampleData: CalendarEvent[] = [
    {
      id: "demo-evt-1",
      summary: "ประชุมติดตามความก้าวหน้าโครงการประจำสัปดาห์ (Weekly Sync)",
      category: "Meeting",
      start: { dateTime: formatIso(addDays(today, -2), 9, 0) },
      end: { dateTime: formatIso(addDays(today, -2), 10, 30) },
      location: "ห้องประชุมออนไลน์ Zoom / ห้องประชุม A1",
      description: "ทบทวน KPI สัปดาห์ก่อน และติดตามปัญหาอุปสรรคของการส่งมอบงาน",
      attendees: [{ email: "somchai@company.com" }, { email: "mario@company.com" }]
    },
    {
      id: "demo-evt-2",
      summary: "ประชุมวางแผนกลยุทธ์ไตรมาสและจัดสรรงบประมาณ",
      category: "Meeting",
      start: { dateTime: formatIso(today, 10, 0) },
      end: { dateTime: formatIso(today, 11, 30) },
      location: "ห้องประชุมใหญ่ ชั้น 4 อาคารอำนวยการ",
      description: "หารือสรุปยอดงบประมาณฝ่าย IT และฝ่ายการตลาดเพื่อเตรียมนำเสนอผู้บริหาร",
      attendees: [{ email: "director@company.com" }, { email: "somchai@company.com" }]
    },
    {
      id: "demo-evt-3",
      summary: "ตรวจรับงานพัฒนาระบบซอฟต์แวร์เฟส 2",
      category: "Task",
      start: { dateTime: formatIso(today, 13, 30) },
      end: { dateTime: formatIso(today, 15, 0) },
      location: "ห้องประชุม IT Dept",
      description: "ตรวจสอบ Demo ระบบและรายการ User Acceptance Test (UAT)",
      attendees: [{ email: "dev-team@company.com" }]
    },
    {
      id: "demo-evt-4",
      summary: "อบรมเชิงปฏิบัติการ: การประยุกต์ใช้ AI ในองค์กรยุคใหม่",
      category: "Workshop",
      start: { dateTime: formatIso(addDays(today, 1), 9, 0) },
      end: { dateTime: formatIso(addDays(today, 1), 12, 0) },
      location: "ห้องสัมมนา B2 โรงแรมเซ็นทารา",
      description: "วิทยากรบรรยายเรื่อง Generative AI & Prompt Engineering สำหรับเพิ่มประสิทธิภาพการทำงาน",
      attendees: [{ email: "all-staff@company.com" }]
    },
    {
      id: "demo-evt-5",
      summary: "พบลูกค้าบริษัท พัฒนาธุรกิจ จำกัด (สัญญานอกสถานที่)",
      category: "Personal",
      start: { dateTime: formatIso(addDays(today, 2), 14, 0) },
      end: { dateTime: formatIso(addDays(today, 2), 16, 0) },
      location: "อาคารสาทรธานี ชั้น 12 กรุงเทพฯ",
      description: "เจรจาต่อสัญญาบริการรายปีและนำเสนอโซลูชันใหม่",
      attendees: [{ email: "client@devbiz.co.th" }]
    }
  ];

  localStorage.setItem('gcal_demo_events_data', JSON.stringify(sampleData));
  return sampleData;
};

export const saveDemoEventsToStorage = (eventsList: CalendarEvent[]) => {
  localStorage.setItem('gcal_demo_events_data', JSON.stringify(eventsList));
};
