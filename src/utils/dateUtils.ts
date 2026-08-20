export const formatThaiDate = (date: Date | string | null, formatStyle: 'short' | 'full' | 'picker' = 'full') => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  const day = d.getDate();
  const month = d.getMonth();
  const yearBE = d.getFullYear() + 543;
  const dayOfWeek = d.getDay();

  if (formatStyle === 'picker') {
    // 19/08/2569
    return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${yearBE}`;
  }
  
  if (formatStyle === 'short') {
    // 19 ส.ค. 2569
    return `${day} ${thaiMonths[month]} ${yearBE}`;
  }

  // full: จ. 19 ส.ค. 2569
  return `${thaiDays[dayOfWeek]} ${day} ${thaiMonths[month]} ${yearBE}`;
};

export const formatThaiTime = (date: Date | string | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};
