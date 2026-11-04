# 🎓 SPSU Udaipur Championship • Day 9: CRUD War Arena
## Student Placement Tracker — Full-Stack Placement-Ready Web Application

[![SPSU Championship](https://img.shields.io/badge/SPSU-Udaipur%20Championship-b71c1c?style=for-the-badge)](https://spsu.ac.in)
[![CRUD Lifecycle](https://img.shields.io/badge/Architecture-Full%20Stack%20CRUD-blue?style=for-the-badge)](#)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Apps%20Script%20%7C%20Sheets-10b981?style=for-the-badge)](#)

---

## 📌 Executive Summary
**Day 9 Mission:** Move beyond isolated programming exercises. Build one complete application where data can be **Created, Read, Updated, and Deleted** through a modern, responsive browser interface and persisted into **Google Sheets** via **Google Apps Script**.

- **Championship Focus:** Full-Stack CRUD Demonstration Project
- **Learning Model:** 10% Concept • 90% Hands-On
- **Tech Stack:** HTML5 • CSS3 (Animations & Glassmorphism) • Modern JavaScript (ES6+ async/await) • Google Sheets • Google Apps Script
- **Outcome:** A live, GitHub-ready project, interactive interview readiness, and LinkedIn proof of work.

---

## 🌟 Key Features & Modern UI Enhancements

- 🎨 **Modern Glassmorphic UI:** Ambient glowing backgrounds, soft shadows, responsive typography (`Outfit` & `Plus Jakarta Sans`).
- ⚡ **Full CRUD Capabilities:**
  - **Create:** Add new students with instant validation and dynamic ID generation.
  - **Read:** Fetch records directly from Google Sheets or interactive local storage.
  - **Update:** Pre-fills form with student details and visual "Edit Mode" glow cues.
  - **Delete:** Custom animated modal confirmation before irreversible deletion.
- 📊 **Real-Time KPI Dashboard:**
  - Live counters for **Total Candidates**, **In Training**, **Interview Ready**, and **Placed Champions**.
  - Animated **Placement Rate %** progress bar.
- 🔍 **Instant Search & Multi-Filter:**
  - Real-time search by candidate name or email.
  - Dropdown filtering by technical domain (Java, Python, Cloud, UI/UX, Data Analytics, AI/ML).
  - Dropdown filtering by placement status (Learning, Interview Ready, Placed).
- 📥 **One-Click CSV Export:** Export current records directly into a `.csv` file.
- 🎉 **Canvas Confetti Particle Celebration:** Triggered automatically when candidates achieve "Placed" status.
- 🔔 **Interactive Toast Notification Engine:** Timed slide-in toast notifications with animated countdown progress indicators.
- 🔄 **Dual Engine (Live API + Instant Demo Mode):** Run immediately in the browser with sample data even before deploying Apps Script, or seamlessly connect to your live Google Sheet with zero setup friction!

---

## 🏗️ Project Architecture

```
[ Browser UI ]
      │
      ▼  (1) JavaScript fetch(API_URL, { method: "POST", body: JSON.stringify(payload) })
[ Google Apps Script Web App (Code.gs) ]
      │
      ▼  (2) SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Students")
[ Google Sheet Database ]
      │
      ▲  (3) JSON Response: { success: true, message: "...", data: [...] }
[ Browser UI ] (Updates DOM, KPI cards, Table, and Confetti)
```

### Folder Structure
```text
student-crud-project/
├── index.html        # Modern Semantic HTML5 UI Structure
├── style.css         # Responsive Styles, Animations, Variables & Glow effects
├── script.js         # Complete CRUD logic, Live API handler, Toast & Confetti
├── Code.gs           # Google Apps Script Web App Backend router
└── README.md         # Documentation, Deployment Guide & Interview Prep
```

---

## 🚀 Setup & Deployment Guide

### Step 1: Create Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Rename the spreadsheet to: `Student Placement Tracker`.
3. Rename the first sheet/tab at the bottom to: `Students`.
4. In **Row 1**, set these exact headers:
   | Column A | Column B | Column C | Column D | Column E | Column F |
   |:---|:---|:---|:---|:---|:---|
   | **ID** | **Name** | **Email** | **Domain** | **Status** | **Created At** |
5. Copy the **Spreadsheet ID** from your browser address bar:
   `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`**`/edit`
   *(The long string between `/d/` and `/edit`)*.

---

### Step 2: Configure Google Apps Script (`Code.gs`)
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Replace all existing code in the editor with the code in [`Code.gs`](./Code.gs).
3. Replace line 16:
   ```javascript
   const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
   ```
   with your actual Spreadsheet ID from Step 1.
4. Click the **Save** icon (💾 or `Ctrl + S`).

---

### Step 3: Deploy as Web App
1. At the top right of Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and choose **Web app**.
3. Configure settings:
   - **Description:** `SPSU Student CRUD API v1`
   - **Execute as:** `Me (your Google email)`
   - **Who has access:** `Anyone` *(Crucial so the frontend browser can make requests without Google login prompt)*
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google Account, click **Advanced** > **Go to Untitled project (unsafe)**, and click **Allow**.
6. Copy the generated **Web App URL** (ends in `/exec`).

---

### Step 4: Connect Frontend to Backend
1. Open `script.js` and paste your URL at line 17:
   ```javascript
   const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
   *OR* simply double-click `index.html` to open it in any browser, click **"API Endpoint Settings"** at the top right, paste your Web App URL, and click **Save & Connect**!

---

## 🧪 Testing the 4 CRUD Operations

| Operation | Action in UI | Expected Result |
|:---|:---|:---|
| **CREATE** | Enter Name, Email, Domain, and Status, then click **Create Student**. | Success toast appears, record appends to Google Sheet Row & UI Table. If status is "Placed", confetti bursts! |
| **READ** | Click **Refresh Data** or reload page. | Table reloads all students from Google Sheet, and KPI metric cards update dynamically. |
| **UPDATE** | Click the blue **Edit** button on any table row. Modify values and click **Update Student**. | Form switches into glowing "Edit Mode", Google Sheet row updates in place, and success toast confirms update. |
| **DELETE** | Click the red **Delete** button on any row. | Custom animated confirmation modal appears. Upon clicking confirm, row is deleted from Google Sheet and removed from table. |

---

## 💼 LinkedIn Proof of Work Post

*Copy, personalize, and publish to showcase your work:*

```markdown
DAY 9 | SPSU UDAIPUR CHAMPIONSHIP 🚀

Today, I moved from isolated programming syntax to building a full-stack, placement-ready CRUD application!

I developed the "Student Placement Tracker" using:
• HTML5 & CSS3 (Custom animations, glassmorphism, responsive design)
• Modern JavaScript (ES6+, async/await, fetch API, custom confetti engine)
• Google Sheets (acting as a persistent cloud database)
• Google Apps Script (REST-like serverless backend)

Key features demonstrated:
🔹 CREATE – Instantly register candidate details with client-side validation
🔹 READ – Fetch real-time candidate data with KPI metrics & live search
🔹 UPDATE – Edit candidate domain & interview status in place
🔹 DELETE – Securely remove records with animated modal confirmation
🔹 DATA EXPORT – One-click export to CSV for placement drive tracking

My biggest takeaway was understanding end-to-end client-server communication, JSON payloads, and how to turn Google Sheets into a powerful, zero-cost cloud database using Apps Script Web Apps!

Day 9 complete. Building in public. Learning by doing. 🔥

#SPSUChampionship #Udaipur #CRUD #JavaScript #WebDevelopment #GoogleAppsScript #GoogleSheets #PlacementReadiness #LearningByDoing #PortfolioProject
```

---

## 🎯 Day 9 Placement Interview Preparation (Top 8 Q&A)

### 1. What is CRUD? Explain it using your project.
> **Answer:** CRUD represents the four foundational operations of persistent storage:
> - **Create:** Adding a new student record into Google Sheets via `sheet.appendRow()`.
> - **Read:** Retrieving student records via `sheet.getDataRange().getValues()` and displaying them in a responsive table.
> - **Update:** Finding a student's row by their unique ID and updating their attributes using `sheet.getRange().setValues()`.
> - **Delete:** Locating the student by ID and removing their record using `sheet.deleteRow()`.

### 2. How does `fetch()` communicate with an API?
> **Answer:** `fetch()` is a modern asynchronous JavaScript API that returns a `Promise`. It sends an HTTP request (such as `GET` or `POST`) to the target URL with optional headers and payload. Once the remote server responds, the Promise resolves to a `Response` object which can be parsed into JSON using `await response.json()`.

### 3. What is JSON and why is it useful?
> **Answer:** JSON (JavaScript Object Notation) is a lightweight, human-readable data-interchange format. It is universally supported across different programming languages and platforms, allowing our JavaScript frontend and Google Apps Script backend to serialize and deserialize structured objects seamlessly.

### 4. What is the difference between GET and POST requests?
> **Answer:**
> - **GET:** Designed for retrieving data without altering server state. Parameters are appended to the URL query string (e.g. `?action=read`). It is cacheable and idempotent.
> - **POST:** Designed for submitting data to create or mutate server state. Payload data is transmitted inside the HTTP request body (`e.postData.contents`), allowing large or sensitive data payloads.

### 5. How did you connect your frontend with Google Sheets?
> **Answer:** We deployed a Google Apps Script file (`Code.gs`) as a public **Web App**. This Web App exposes `doGet()` and `doPost()` handlers that receive HTTP requests from JavaScript `fetch()`. The script uses the native `SpreadsheetApp` API to read and write rows into the bound Google Sheet and returns JSON via `ContentService`.

### 6. How did you identify a record for update or deletion?
> **Answer:** Each student record is assigned a unique timestamp-based identifier (`new Date().getTime().toString()`) at creation, stored in Column A. When an update or delete request is triggered, the `findRowById()` function inspects Column A values and finds the matching row index.

### 7. What happens when an API request fails?
> **Answer:** The frontend uses `try...catch` blocks around all `fetch()` calls. If a network interruption or server error occurs, the catch block catches the error, dismisses the loading spinner, and displays a user-friendly error notification via the toast engine without crashing the UI.

### 8. How would you improve this application for 1,000+ users?
> **Answer:**
> 1. **Database Migration:** Transition from Google Sheets to a dedicated relational database (PostgreSQL / MySQL) or NoSQL (MongoDB / Firebase) to handle high concurrency and ACID transactions.
> 2. **Authentication & RBAC:** Implement JWT-based authentication so students can only view records while Placement Officers have write/delete permissions.
> 3. **Pagination & Indexing:** Implement server-side pagination (e.g., `limit` and `offset`) to prevent loading thousands of rows at once.
> 4. **Caching & CDN:** Implement Redis caching for read-heavy operations.

---

## 🏆 Final Day 9 Submission Checklist
- [x] Google Sheet created with headers: `ID, Name, Email, Domain, Status, Created At`
- [x] Apps Script backend deployed with access set to "Anyone"
- [x] Web App URL connected in `script.js` / UI settings
- [x] **Create** operation tested & confirmed
- [x] **Read** operation tested & confirmed
- [x] **Update** operation tested & confirmed
- [x] **Delete** operation tested & confirmed
- [x] Responsive UI tested on desktop & mobile screen sizes
- [x] Modern animations, KPI counters, and Confetti tested
- [x] Ready to push to GitHub & post on LinkedIn!

