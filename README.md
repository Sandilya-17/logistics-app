# Enterprise Logistics Management System v2.0

A full-stack enterprise logistics platform built with React + Spring Boot + MongoDB.

---

## WHAT'S NEW IN v2.0

### Authentication & Role-Based Access
- JWT-based login with Admin and Employee roles
- Admin: Full access to all modules including User Management
- Employee: Configurable per-module permissions
- Default credentials auto-seeded on first run:
  - Admin:    username=`admin`        password=`admin123`
  - Employee: username=`employee1`   password=`emp123`

### New Modules
- **Trips / Challan** — Full freight trip management with LR numbers, consignee, payment tracking
- **User Management** (Admin only) — Create/edit/deactivate users, assign permissions

### Upgraded Modules
- **Fleet Master** — Added vehicle type, make/model/year, odometer, RC/Insurance/Fitness/Permit expiry with color alerts
- **Fuel Management** — Odometer tracking, payment modes, invoice numbers, entered-by tracking
- **Spare Parts** — Categories, reorder levels, unit price, vendor, HSN/GST, job card & mechanic tracking
- **Tyre Stock** — Tyre type, reorder levels, position tracking on issue
- **Reports** — 8 report types with month/year filtering

### Tally-Style UI
- Dark monospace theme inspired by Tally ERP
- Dense data tables with row highlighting
- Status bar with keyboard shortcut hints
- Color-coded badges (green=ok, red=excess/low stock, yellow=warning)
- Sidebar with collapse toggle

---

## SETUP

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB running on localhost:27017

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend starts on http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend starts on http://localhost:3000

---

## API ENDPOINTS

### Auth
- POST /api/auth/login — { username, password } → { token, role, ... }
- GET  /api/auth/me — current user info

### Trucks (all authenticated)
- GET/POST /api/trucks
- GET/PUT/DELETE /api/trucks/{id}
- GET /api/trucks/numbers

### Fuel
- GET/POST /api/fuel
- GET /api/fuel/monthly?month=&year=
- GET /api/fuel/excess-report?month=&year=
- GET /api/fuel/truck/{truckNumber}

### Trips
- GET/POST /api/trips
- GET/PUT/DELETE /api/trips/{id}
- GET /api/trips/summary
- GET /api/trips/truck/{truckNumber}
- GET /api/trips/status/{status}

### Spare Parts
- GET/POST /api/spare-parts
- POST /api/spare-parts/purchases
- POST /api/spare-parts/issues
- GET /api/spare-parts/issues
- GET /api/spare-parts/stock-report

### Tyres
- GET/POST /api/tyres
- POST /api/tyres/purchases
- POST /api/tyres/issues
- GET /api/tyres/issues
- GET /api/tyres/stock-report

### User Management (ADMIN only)
- GET/POST /api/admin/users
- PUT/DELETE /api/admin/users/{id}

---

## CORE LOGIC — UNCHANGED FROM v1.0
- FuelService.getMonthlyExcessReport() — fuel limit vs consumed calculation
- SparePartService.issuePart() — stock availability check + deduction
- TyreService.issueTyre() — tyre stock availability check + deduction
- All opening/purchased/issued/closing stock calculations

---

## EMPLOYEE PERMISSIONS
When creating an employee user, assign these permissions:
- VIEW_TRUCKS — can see fleet master
- FUEL_ENTRY — can add fuel entries
- TRIPS — can manage trips
- SPARE_PART_ISSUE — can issue spare parts
- TYRE_ISSUE — can issue tyres
- VIEW_REPORTS — can view reports

Admins automatically have all permissions.
