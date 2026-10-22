# 🎓 Student Management System (MERN Stack)

> **College Term Work-2 Micro Project**  
> Built with MongoDB, Express.js, React.js, Node.js, RESTful API architecture, and JWT Authentication.

---

## 📌 1. Project Overview

The **Student Management System** is a full-stack web application designed for educational institutions to digitally maintain, track, and administer student records. 

It implements a complete **MERN** architecture featuring a decoupled client-server model:
- **Backend**: RESTful API powered by Node.js and Express.js, interfacing with MongoDB via Mongoose ODM.
- **Frontend**: Single Page Application (SPA) powered by React.js with client-side routing via React Router and HTTP communication via Axios.
- **Security**: Salted password hashing with `bcryptjs` and stateless session management with JSON Web Tokens (JWT).

---

## ✨ 2. Key Features

- **Home Page**: Interactive landing page with project overview, technology highlights, and quick access navigation.
- **User Authentication**:
  - Administrator/Staff Registration with validation.
  - Secure Login with bcrypt-hashed password comparison.
  - JWT token generation and storage in `localStorage`.
- **Protected Student Dashboard**:
  - Live metric summary cards (Total Students, Department count, Live DB sync status).
  - Responsive table layout with mobile optimization.
  - Instant client/server search filtering by student name, roll number, department, or email.
- **Full CRUD Functionality**:
  - **Create**: Add new student with roll number uniqueness validation.
  - **Read**: Fetch all student profiles or retrieve individual student records.
  - **Update**: Edit existing student details with pre-populated form controls.
  - **Delete**: Remove student records with a custom confirmation dialog to prevent accidental data loss.
- **User-Friendly Notifications**:
  - Dynamic success and error alerts.
  - Loading spinners for asynchronous API requests.
  - Responsive navigation bar with mobile hamburger menu and one-click logout.

---

## 🛠️ 3. Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Database** | MongoDB | Document-oriented NoSQL database for flexible JSON-like storage |
| **ODM** | Mongoose (v8) | Object Data Modeling library providing schema validation & queries |
| **Backend** | Node.js & Express.js | Asynchronous runtime and RESTful web server framework |
| **Frontend** | React.js (v18) | Component-driven UI library for single-page applications |
| **Routing** | React Router (v6) | Declarative client-side routing with route protection |
| **HTTP Client**| Axios | Promise-based HTTP client with request/response interceptors |
| **Auth & Security** | JWT & BcryptJS | Token-based stateless authentication and password hashing |
| **Styling** | Custom Responsive CSS | Clean, modern UI with CSS variables, Flexbox, and Grid |

---

## 📂 4. Folder Structure

```text
MERN-Student-Management/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic using Mongoose
│   ├── controllers/
│   │   ├── authController.js   # User register, login, profile logic
│   │   └── studentController.js# Student CRUD operations + search queries
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT token verification middleware
│   │   └── errorMiddleware.js  # 404 & Centralized error handler
│   ├── models/
│   │   ├── User.js             # User Schema (name, email, password, createdAt)
│   │   └── Student.js          # Student Schema (name, rollNumber, email, department, year, createdAt)
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints (/api/auth)
│   │   └── studentRoutes.js    # Student CRUD endpoints (/api/students)
│   ├── .env.example            # Backend environment variables template
│   ├── package.json            # Backend dependencies & scripts
│   └── server.js               # Express application entry point
├── frontend/
│   ├── public/
│   │   └── favicon.svg         # Graduation cap icon
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js# Axios instance with JWT request interceptor
│   │   ├── components/
│   │   │   ├── Alert.jsx       # Reusable notification alert component
│   │   │   ├── ConfirmModal.jsx# Delete confirmation modal
│   │   │   ├── Footer.jsx      # Academic project footer
│   │   │   ├── Navbar.jsx      # Responsive navigation with auth state
│   │   │   └── ProtectedRoute.jsx # Route guard for logged-in users
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user authentication state provider
│   │   ├── pages/
│   │   │   ├── AddStudent.jsx  # Student registration form
│   │   │   ├── Dashboard.jsx   # Student records table, metrics & live search
│   │   │   ├── EditStudent.jsx # Student edit form with preloaded data
│   │   │   ├── Home.jsx        # Landing hero & feature showcase
│   │   │   ├── Login.jsx       # Admin login page
│   │   │   └── Register.jsx    # Admin registration page
│   │   ├── App.jsx             # Router and page configuration
│   │   ├── index.css           # Modern responsive design & typography
│   │   └── main.jsx            # React root DOM mount
│   ├── .env.example            # Frontend environment variables template
│   ├── index.html              # HTML entry template
│   ├── package.json            # Frontend dependencies & scripts
│   └── vite.config.js          # Vite build configuration with API proxy
├── .gitignore                  # Git ignore rules for node_modules & secrets
└── README.md                   # Complete documentation
```

---

## ⚙️ 5. Environment Variables Setup

### Backend Environment Variables (`backend/.env`)
Create a file named `.env` inside the `backend/` directory (see `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/student_management
JWT_SECRET=supersecret_mern_student_management_jwt_key_2026
```

> **Note:** If using **MongoDB Atlas** (cloud database), replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_management?retryWrites=true&w=majority`

### Frontend Environment Variables (`frontend/.env`)
Create a file named `.env` inside the `frontend/` directory (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🍃 6. MongoDB Database Setup

You can use either a **Local MongoDB** instance or **MongoDB Atlas (Cloud)**.

### Option A: Local MongoDB
1. Ensure MongoDB Community Server is installed.
2. Start the MongoDB service:
   ```bash
   # On Linux/macOS
   sudo systemctl start mongod
   # Or directly
   mongod --dbpath /data/db
   ```
3. The default URI `mongodb://127.0.0.1:27017/student_management` connects automatically.

### Option B: MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user with password.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** > **Drivers** > copy the connection string into `backend/.env`.

---

## 🚀 7. Installation & Running Instructions

### Step 1: Clone or Open the Repository
```bash
cd MERN-Student-Management
```

### Step 2: Setup and Run the Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
# OR for standard start
npm start
```
The backend server starts on: **`http://localhost:5000`**

### Step 3: Setup and Run the Frontend Client
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend application will run on: **`http://localhost:3000`**

---

## 📡 8. REST API Endpoints Specification

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new admin account | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | Log in and receive JWT token | `{ email, password }` |
| `GET` | `/api/auth/me` | Private | Fetch current user profile | *(Bearer token required)* |

### Student Management Routes (`/api/students`)

*All student routes require `Authorization: Bearer <token>` in the request header.*

| Method | Endpoint | Access | Description | Query / Body Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Private | Get all students (or search) | `?search=keyword` *(optional)* |
| `GET` | `/api/students/:id` | Private | Get single student details | URL parameter `:id` |
| `POST` | `/api/students` | Private | Add a new student | `{ name, rollNumber, email, department, year }` |
| `PUT` | `/api/students/:id` | Private | Update student details | `{ name, rollNumber, email, department, year }` |
| `DELETE` | `/api/students/:id`| Private | Delete student record | URL parameter `:id` |

---

## 📋 9. Database Schemas

### User Schema (`models/User.js`)
```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 }, // Hashed using bcrypt
  createdAt: { type: Date, default: Date.now }
}
```

### Student Schema (`models/Student.js`)
```javascript
{
  name:        { type: String, required: true, trim: true },
  rollNumber:  { type: String, required: true, unique: true, uppercase: true },
  email:       { type: String, required: true, lowercase: true },
  department:  { type: String, required: true },
  year:        { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
}
```

---

## 🎓 10. Viva-Voce Preparation Guide

### Q1: What is the MERN stack and how do the components interact?
> **Answer**: MERN stands for **M**ongoDB, **E**xpress.js, **R**eact.js, and **N**ode.js.
> - **React.js** runs in the user's browser, managing state and rendering the user interface.
> - **Axios** sends asynchronous HTTP requests (GET, POST, PUT, DELETE) carrying JSON payloads.
> - **Node.js + Express.js** receives the HTTP requests on defined routes, validates input, verifies JWT tokens via middleware, and triggers controller functions.
> - **Mongoose** translates the controller queries into MongoDB operations to store and fetch documents in BSON format.

### Q2: Why is `bcrypt` used for passwords instead of plain text or MD5?
> **Answer**: Plain text passwords leave users vulnerable to database breaches. MD5 and SHA-1 are fast and susceptible to rainbow table and brute-force attacks. `bcrypt` incorporates a configurable **salt** (random bits added before hashing) and a **work factor** (key stretching), making brute-force cracking computationally impractical.

### Q3: How does JWT authentication work in this application?
> **Answer**: 
> 1. When a user logs in via `/api/auth/login`, the server verifies the password with `bcrypt.compare()`.
> 2. If valid, the server signs a JSON Web Token with the user's ID and a secret key (`jwt.sign()`).
> 3. The frontend stores this token in `localStorage`.
> 4. For subsequent requests, an Axios request interceptor attaches the token as `Authorization: Bearer <token>`.
> 5. The server's `authMiddleware` intercepts the request, verifies the token using `jwt.verify()`, and attaches `req.user`.

### Q4: What is CORS and why is it needed?
> **Answer**: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making AJAX requests to a different domain or port. Because React runs on `http://localhost:3000` and Express runs on `http://localhost:5000`, CORS middleware enables explicit permission for the frontend to communicate with the backend.

### Q5: How is search functionality implemented?
> **Answer**: The dashboard search bar triggers a query parameter: `/api/students?search=keyword`. On the backend, `studentController.js` constructs a MongoDB `$or` query with regular expressions (`$regex: keyword, $options: 'i'`), searching across `name`, `rollNumber`, `department`, and `email` without case sensitivity.

---

## 📄 License
This project is open-source under the MIT License for educational and academic submission purposes.
