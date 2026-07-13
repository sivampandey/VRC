# Vaishnav Rug Collection (VRC) — E-Commerce & Custom Configurator Portal

Woven with Tradition, Made for Generations. VRC is a luxury handcrafted carpet showroom platform inspired by the double-weft hand-knotted legacy of Bhadohi, India.

---

## 🌟 Key Features

1. **Luxury E-Commerce Showroom**: Dynamic catalog with categorized listings (Traditional, Silk Luxe, Modern Abstract, Organic Jute) and detailed size charts.
2. **Live Visual Order Tracker**: Icon-based visual progress stepper tracking orders from placement, weaving in Bhadohi, to courier shipment and delivery with active tracking updates.
3. **Real-time Status Polling**: Orders and custom inquiries dynamically sync and update on-screen every **3 seconds** in the background without refreshing the page.
4. **Interactive Custom Rug Configurator**: Allows clients to select shapes (Rectangle, Round, Oval, Runner), dimensions, materials, and upload reference patterns directly to weavers.
5. **Automated Client Notifications**: Triggers HTML email confirmations and Twilio WhatsApp notifications upon inquiry submission, shipping, or status transitions.
6. **Premium Admin Command Console**: Allows admins to modify statuses, attach package tracking codes, manage catalog items, and view custom requests securely.

---

## 🛠️ Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- *Optional:* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`). If MongoDB is not installed or running, the project will automatically fall back to an In-Memory MongoDB server for a zero-configuration developer experience.

---

## 🚀 Quick Start (Run Both Backend & Frontend Simultaneously)

To run both the backend server and frontend client concurrently using a single command from the project root:

1. **Install dependencies in the root folder** (only needed once):
   ```bash
   npm install
   ```

2. **Start both servers concurrently**:
   ```bash
   npm run dev
   ```
   *This starts the frontend at `http://localhost:5173` and the backend at `http://localhost:5000`.*

---

## 🛠️ Separate Startup Commands

If you prefer to run the backend and frontend separately in individual terminal windows, use the following commands:

### 1. Run the Backend Server
```bash
cd server
npm install
npm run dev      # Runs in development auto-reload mode
# or npm start   # Runs in standard production mode
```
*The API will run at `http://localhost:5000`.*

### 2. Run the Frontend Client
```bash
cd client
npm install
npm run dev
```
*The website will run locally at `http://localhost:5173`.*

---

## 🔧 Troubleshooting: EADDRINUSE Error (Port 5000 Conflict)

If you see `Error: listen EADDRINUSE: address already in use 0.0.0.0:5000` when starting the server, it means an orphaned background Node process is already using port `5000`. You can free the port by running the following commands in PowerShell (Windows):

1. **Find the Process ID (PID)** currently using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. **Terminate the process** (replace `<PID>` with the actual PID number returned from the previous command, e.g. `1092`):
   ```powershell
   taskkill /f /pid <PID>
   ```

---

## ⚙️ Environment Configurations

Create a `.env` file in the `server` root folder with the following keys:
```env
PORT=5000

# For Local Database:
MONGODB_URI=mongodb://127.0.0.1:27017/vrc

# For Cloud / Multi-Device Database (MongoDB Atlas):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vrc?retryWrites=true&w=majority

JWT_SECRET=vrc_super_secret_jwt_key_2024
JWT_REFRESH_SECRET=vrc_refresh_secret_2024
CLIENT_URL=http://localhost:5173

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Before running the server for the first time, you can seed the database with catalog items and default administrator credentials:
```bash
cd server
npm run seed
```

---

## 🔐 Seeding / Admin Credentials

Seeding the database creates a default administrative user. You can log in using:

* **Admin Email**: `admin@vaishnavrug.com`
* **Admin Password**: `adminpassword`

To promote any registered user account to admin, run this utility from the `server` directory:
```bash
node make-admin.js <user-email-address>
```

---

## 🎨 Project Creator & Maintainer

* **Proprietor**: Rashmi Jaiswal
* **Showroom Location**: Mehboobpur, Bhadohi, Uttar Pradesh, India – 221401
* **Contact Phone**: +91 87076 30603 | +91 91295 15971
* **Showroom Email**: `admin@vaishnavrug.com`

* **Created & Maintained By** : Shivam Pandey