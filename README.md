# Finance Tracker - Frontend

Aplikasi web untuk mengelola keuangan pribadi menggunakan React & Tailwind CSS.

## 🚀 Teknologi
- React 18
- Tailwind CSS
- Lucide React (Icons)
- Fetch API

## ✨ Fitur
- ✅ Dashboard dengan statistik (Pemasukan, Pengeluaran, Saldo)
- ✅ CRUD Transaksi lengkap
- ✅ Filter transaksi (Semua, Pemasukan, Pengeluaran)
- ✅ Responsive design
- ✅ Real-time update dari database

## 🔧 Setup Lokal

### Requirements
- Node.js 14+
- npm atau yarn

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/USERNAME/finance-tracker-frontend.git
cd finance-tracker-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL di `src/App.js`:
```javascript
const API_URL = 'http://localhost/finance-tracker-api/api/transactions';
```

4. Jalankan development server:
```bash
npm start
```

5. Buka browser:
```
http://localhost:3000
```

## 📦 Build untuk Production
```bash
npm run build
```

File build akan ada di folder `build/`

## 🔗 Backend Repository
[finance-tracker-backend](https://github.com/USERNAME/finance-tracker-backend)

## 👤 Author
Nama Anda - [GitHub](https://github.com/USERNAME)

## 📄 License
MIT
```

---

## 🎯 **Untuk Manual Book & Video**

Kalau pakai **2 repositories**, di manual book jelaskan:

### **Arsitektur Terpisah:**
```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (React)       │ ◄────► │   (PHP + MySQL) │
│   Vercel        │  Fetch  │   Railway       │
└─────────────────┘   API   └─────────────────┘
