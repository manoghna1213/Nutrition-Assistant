<<<<<<< HEAD
<<<<<<< HEAD
# Nutrition Assistant

Nutrition Assistant is a production-ready, industry-level wellness management platform built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It provides a secure, role-based ecosystem for clients, dietitians, and platform administrators.

---

## Key Features

- **Authentication Module**: Secure login, registration, and logout utilizing JSON Web Tokens (JWT) and Bcrypt password hashing.
- **Client (User) Tools**: Log daily meals, fluid levels, weight, and exercise minutes. Access customized diet plans, BMI trend charts, and an AI recommendation assistant.
- **Dietitian Dashboard**: Manage assigned client portfolios, view client nutrition progression logs, and construct tailored meal plans.
- **Administrator Panel**: View global analytics (demographics, growths, registrations), update user authorizations, and monitor system logs.
- **Bonus Modules**: Simulated barcode reader, rule-based meal suggestions, CSV logs export, and custom PDF printer guide.

---

## Technology Stack

- **Frontend**: React.js, React Router v6, Axios, Recharts (Dynamic Charts), React Hook Form, Context API.
- **Backend**: Node.js, Express.js, Multer (File Uploads), Helmet, CORS, Express-Rate-Limit.
- **Database**: MongoDB Atlas, Mongoose schemas.
- **Styling**: Bootstrap 5 with premium dark mode theme variables and glassmorphism layouts.

---

## Folder Structure

```text
nutrition-assistant/
│
├── client/                      # React-Vite Frontend
│   ├── src/
│   │   ├── assets/              # Icons, images
│   │   ├── components/          # Sidebar, Navbar, Route Guards
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Landing, Dashboards, Calculations, Logs
│   │   ├── App.jsx              # Routing configurations
│   │   └── main.jsx             # React mount entry
│   └── package.json
│
├── server/                      # Node-Express Backend
│   ├── config/                  # Database connections
│   ├── controllers/             # Controller handlers
│   ├── middleware/              # Auth, Upload, Validation, Error layers
│   ├── models/                  # User, Client, MealPlan, Progress, Notification
│   ├── routes/                  # API Routers
│   ├── utils/                   # Seeding scripts
│   ├── validations/             # express-validator chains
│   ├── app.js                   # Middleware stack configuration
│   └── server.js                # App listener
│
├── nutrition_assistant_postman_collection.json  # Postman API Collection
└── README.md                    # Project Manual
```

---

## Database Schema (ERD)

### Users Collection
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, selected false by default)
- `role` (String, enum: ['User', 'Dietitian', 'Admin'])
- `phone` (String)
- `gender` (String)
- `age` (Number)
- `height` (Number)
- `weight` (Number)
- `bmi` (Number)
- `calorieGoal` (Number)
- `dietaryPreference` (String, default: 'None')

### Clients Collection
- `userId` (ObjectId, ref User, unique)
- `dietitianId` (ObjectId, ref User, nullable)
- `healthConditions` (Array of Strings)
- `allergies` (Array of Strings)
- `goals` (String)
- `status` (String, enum: ['Pending', 'Active', 'Suspended'])

### MealPlans Collection
- `clientId` (ObjectId, ref User)
- `dietitianId` (ObjectId, ref User)
- `breakfast` (String)
- `lunch` (String)
- `dinner` (String)
- `snacks` (String)
- `calories` (Number)
- `protein` (Number)
- `carbohydrates` (Number)
- `fats` (Number)
- `waterGoal` (Number)
- `notes` (String)

---

## Installation & Launch Guide

### Prerequisites
- Node.js installed locally.
- MongoDB running on `mongodb://127.0.0.1:27017/` (or supply Atlas URI in `.env`).

### Step 1: Clone and setup backend server
1. Navigate to `/server`.
2. Configure `.env` file if custom ports/Atlas URI are required:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/nutrition_assistant
   JWT_SECRET=supersecretkey12345nutritionassistantsecret
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
3. Run `npm install` to load dependencies.
4. Execute database seeder script to populate credentials and historic charts records:
   ```bash
   npm run seed
   ```
5. Launch the backend API server:
   ```bash
   npm run dev
   ```

### Step 2: Setup client frontend
1. Navigate to `/client`.
2. Run `npm install` to load dependencies.
3. Launch client Vite server:
   ```bash
   npm run dev
   ```

---

## API Documentation

### Auth Enpoints
- `POST /api/auth/register` - Register user or dietitian.
- `POST /api/auth/login` - Authenticate user and return JWT.
- `POST /api/auth/forgot-password` - Request password recovery code.
- `POST /api/auth/reset-password` - Reset password.

### User Profiles
- `GET /api/users` - Get all users (Admin/Dietitian only).
- `GET /api/users/:id` - Fetch profile metadata.
- `PUT /api/users/:id` - Update profile metrics (Height/Weight updates recalculate BMI).
- `DELETE /api/users/:id` - Purge account.

### Meal Plans
- `POST /api/mealplans` - Save meal plan (Dietitian only).
- `GET /api/mealplans` - Retrieve meal plan.
- `PUT /api/mealplans/:id` - Edit meal plan.

### Logs & Progress
- `POST /api/progress` - Upsert daily food calorie and water logs.
- `GET /api/progress` - Get history timeline dataset.

---

## Sample Login Credentials (from Seed)

- **Admin**: `admin@nutrition.com` / `admin123`
- **Dietitian**: `dietitian1@nutrition.com` / `dietitian123`
- **User (Client)**: `user1@nutrition.com` / `user123`
=======
# Nutrition-Assistant
>>>>>>> d450f6869586c75ed019aa7b654d3e9b1497795c
=======
# Nutrition-Assistant
>>>>>>> d3b2b8385024daabbb1bf1e5ca61c9958af826ab
