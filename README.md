# 🍔 Food Franchise Management Platform (MERN Stack)

A simple, production-ready, and stylish MERN stack platform for managing food franchises, franchise owners, staff members, and product catalogs with role-based access control (RBAC).

---

## 📌 Features Overview

### 👑 1. Super Admin Module

- **Seed-only Registration**: Admin accounts cannot be created publicly. Seeded via script.
- **Platform Analytics**: Total franchises, active/inactive franchises, total staff, and total products.
- **Franchise Management**: Create new franchises with auto-generated Franchise Owner accounts. Edit, view, or toggle franchise status (Active/Inactive).
- **Staff Directory**: Read-only view of all staff members across all franchises and location details.
- **User Directory**: View all system users (Admins, Franchise Owners, Staff) and account statuses.

### 🏢 2. Franchise Owner Module

- **Isolated Data Access**: Franchise Owners can **ONLY** view and manage data belonging to their own franchise.
- **Staff Management**: Add, edit details, and activate/deactivate staff members for their franchise.
- **Product Catalog Management**: Add, edit, delete, search, filter by category (`Pizza`, `Burger`, `Beverages`, `Dessert`, `Other`), and toggle stock availability.
- **Read-Only System Metric**: View total active system franchises count on dashboard.

### 👨‍🍳 3. Staff Module

- **Franchise Product Catalog**: View products belonging exclusively to their assigned franchise.
- **Live Stock Toggle**: Toggle product stock status (`Available` $\leftrightarrow$ `Out of Stock`).
- **Strict Role Boundaries**: Staff cannot add, edit, or delete products or staff members.

---

---

## 🚀 Step-by-Step Guide to Run the Application

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

---

### Step 1: Install Backend Dependencies

Open a terminal in the project root:

```bash
cd backend
npm install
```

### Step 2: Environment Setup (`backend/.env`)

Ensure `backend/.env` has the following variables configured:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_db
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
JWT_SECRET?
JWT_EXPIRES_IN=7d
```

### Step 3: Seed Super Admin User

Run the seeding script to populate the Admin account in MongoDB:

```bash
npm run seed:admin
```

_Console Output:_

```
Connected to MongoDB for seeding...
----------------------------------------------------

----------------------------------------------------
```

### Step 4: Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

---

### Step 5: Install Frontend Dependencies

Open a **new** terminal window:

```bash
cd frontend
npm install
```

### Step 6: Environment Setup (`frontend/.env`)

Ensure `frontend/.env` has the following configuration:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 7: Start the Frontend Application

```bash
npm run dev
```

The application will open on `http://localhost:5173`.

---

## 🎮 How to Use the Application (Step-by-Step Flow)

### 1. Log in as Super Admin

1. Open `http://localhost:5173/` (Redirects to Login Page).
2. Enter Emailand Password: `Dipesh@123`.
3. You will land on the **Admin Dashboard**.
4. Go to **Franchises** $\rightarrow$ Click **Create Franchise**.
5. Fill in Franchise Name, City, Owner Name, Owner Email (e.g. `owner1@franchise.com`), and Password (e.g. `Owner@1234`).
6. Click **Create Franchise**. The franchise and owner account are created!

### 2. Log in as Franchise Owner

1. Click **Logout** in the sidebar.
2. Log in with the newly created Franchise Owner credentials (`owner1@franchise.com` / `Owner@1234`).
3. You will land on your **Franchise Dashboard**.
4. Go to **Staff Management** $\rightarrow$ Click **Add Staff Member** to register a staff user (e.g. `staff1@franchise.com` / `Staff@1234`).
5. Go to **Products Catalog** $\rightarrow$ Click **Add Product** to create food items (e.g. "Margherita Pizza", Category: `Pizza`, Price: `$12.99`).

### 3. Log in as Staff Member

1. Click **Logout**.
2. Log in with the Staff credentials (`staff1@franchise.com` / `Staff@1234`).
3. You will land on the **Staff Dashboard**.
4. Go to **Menu Inventory** to view your franchise products.
5. Use the **Availability Switch** to toggle items between `Available` and `Out of Stock`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide React Icons.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`.
- **Theme**: Crisp Orange & White Food App Aesthetics.
