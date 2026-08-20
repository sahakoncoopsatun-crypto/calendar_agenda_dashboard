# Google Calendar Agenda Dashboard

Web Application สำหรับสรุปรายการกำหนดการ (Agenda) จาก Google Calendar สร้างรายงาน สถิติเวลาการปฏิบัติงาน พร้อมระบบ Export เป็น CSV พัฒนาด้วย React, TypeScript, Vite และ Tailwind CSS v4

## 🚀 ฟีเจอร์หลัก (Features)
- **เชื่อมต่อ Google Calendar API:** ใช้งานผ่าน Google OAuth 2.0 (Sign in with Google) ที่ปลอดภัย
- **โหมดทดสอบ (Demo Mode):** มีระบบจำลองข้อมูล (Mock Data) สำหรับทดสอบ UI ทันที
- **กรองข้อมูลแบบละเอียด:** กรองตามช่วงเวลา วันนี้, สัปดาห์นี้, เดือนนี้, หมวดหมู่งาน, และค้นหาข้อความ
- **สรุปสถิติ (Statistics):** คำนวณชั่วโมงรวม, การประชุมกลุ่ม, และการออกพื้นที่โดยอัตโนมัติ
- **รายงาน (Report):** ส่งออกข้อมูลทั้งหมดออกเป็นไฟล์ CSV หรือสั่งพิมพ์ได้ทันที
- **จัดการกำหนดการ (CRUD):** เพิ่ม, แก้ไข, ลบ กำหนดการจากหน้าเว็บไปยัง Google Calendar ได้โดยตรง

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Authentication:** @react-oauth/google
- **Dates Handling:** date-fns

## 💻 การติดตั้งและรันในเครื่อง (Local Setup)

1. **โคลนโปรเจกต์ หรือแตกไฟล์ ZIP**
   เปิดโฟลเดอร์โปรเจกต์ใน Terminal หรือ VS Code

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env` ไว้ที่โฟลเดอร์นอกสุด (ระดับเดียวกับ package.json) และเพิ่มรหัส Client ID ของคุณดังนี้:
   ```env
   VITE_GOOGLE_CLIENT_ID=รหัส-client-id-ของคุณ.apps.googleusercontent.com
   ```
   *(หมายเหตุ: หากไม่มี สามารถใช้ Demo Mode ไปก่อนได้)*

4. **รันเซิร์ฟเวอร์จำลอง (Development Server)**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ลิงก์ที่แสดงใน Terminal (เช่น `http://localhost:5173`)

## 📦 การคอมไพล์เพื่อใช้งานจริง (Production Build)
รันคำสั่งด้านล่างเพื่อสร้างไฟล์ Static ให้พร้อมสำหรับนำไปโฮสต์ (เช่น Netlify, Vercel, GitHub Pages)
```bash
npm run build
```
ไฟล์ที่พร้อมใช้งานจะอยู่ในโฟลเดอร์ `dist/`

## ⚙️ การสร้าง Google Client ID
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจกต์ใหม่
3. ไปที่เมนู **APIs & Services** > **Credentials**
4. กด **Create Credentials** เลือก **OAuth client ID**
5. เลือกประเภทแอปเป็น **Web application**
6. ใส่ Authorized JavaScript origins เป็นลิงก์เว็บของคุณ (เช่น `http://localhost:5173` สำหรับทดสอบ)
7. นำ Client ID ที่ได้มาใช้งาน
