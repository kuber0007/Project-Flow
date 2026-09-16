<div align="center">

# 📋 ProjectFlow
**A Full-Stack Project Management Tool to Manage Projects, Tasks and Teams**

Plan projects, manage tasks, collaborate with teammates, and keep work organized across shared workspaces.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ProjectFlow-5B6EF5?style=for-the-badge)](https://project-flow-1-zwv5.onrender.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square\&logo=vite\&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square\&logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?style=flat-square\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)

[Live Demo](https://project-flow-1-zwv5.onrender.com/) · [Report a Bug](../../issues/new?template=bug_report.yml) · [Request a Feature](../../issues/new?template=feature_request.yml)

</div>

---

## 📖 Overview

**ProjectFlow** is a full-stack project management application for teams that need a structured way to organize projects, tasks, members, and collaboration.

The application uses a separate React/Vite frontend and Node/Express REST API backend, with MongoDB as the primary database and Cloudinary for image storage.

> **Live application:** https://project-flow-1-zwv5.onrender.com/

---

## ✨ Features

* 🔐 **Secure Authentication** — JWT-based registration, login, logout, password change, and password reset
* 🏢 **Workspace Management** — Create, switch, configure, delete, and manage workspace members
* 📁 **Project Management** — Create projects, manage members, search, filter, and track project work
* ✅ **Task Management** — Create, assign, update status, set priorities, and manage due dates
* 👥 **Team Collaboration** — Invite members, manage roles, comments, notifications, and team workflows
* 👤 **Profile & Branding** — Manage profiles, upload avatars, and customize workspaces with logos
* 📱 **Responsive Interface** — Clean and responsive experience across desktop, tablet, and mobile
* 🚀 **Production Ready** — Separate React frontend and Node.js REST API with Render deployment

---

## 🛠️ Tech Stack

| Layer           | Tech                               |
| --------------- | ---------------------------------- |
| Frontend        | React 19, Vite 8, React Router     |
| UI & Forms      | CSS, React Hook Form, Lucide React |
| Backend         | Node.js, Express 5, Axios          |
| Database        | MongoDB, Mongoose                  |
| Authentication  | JWT, bcryptjs                      |
| Storage & Email | Cloudinary, Multer, Nodemailer     |
| Deployment      | Render                             |

---

## 🏗️ Architecture

```text
                         ┌─────────────────────────┐
                         │      ProjectFlow UI      │
                         │       React + Vite       │
                         └────────────┬────────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌─────────────────────────┐
                         │    ProjectFlow API      │
                         │     Node + Express      │
                         └───────┬─────────┬───────┘
                                 │         │
                    ┌────────────┘         └─────────────┐
                    ▼                                    ▼
          ┌──────────────────┐                 ┌──────────────────┐
          │     MongoDB      │                 │    Cloudinary    │
          │ Users / Projects │                 │ Avatars / Logos  │
          │ Tasks / Members  │                 └──────────────────┘
          └──────────────────┘
                                 │
                                 ▼
                         ┌──────────────────┐
                         │    Nodemailer    │
                         │ Email workflows  │
                         └──────────────────┘
```

---

## 🚀 Getting Started

### 📋 Prerequisites

* Node.js 18+ (Node.js 24 is used in the current Render deployment)
* npm
* MongoDB / MongoDB Atlas
* Cloudinary account for image uploads
* SMTP credentials for email features

### 1. 📥 Clone

```bash
git clone https://github.com/kuber0007/Project-Flow.git
cd Project-Flow
```

### 2. 💻 Frontend

```bash
cd client
npm install
```

Create:

```text
client/.env.local
```

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. ⚙️ Backend

```bash
cd ../server
npm install
```

### Create `.env` file in the `server` folder

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=10h

CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. ▶️ Start the backend

From `server/`:

```bash
npm run dev
```

### 5. 🌐 Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite.

---

## 🧰 Development Commands

### 💻 Frontend

```bash
cd client
npm run dev
npm run build
npm run lint
npm run preview
```

### ⚙️ Backend

```bash
cd server
npm run dev
npm start
```
---

## 📂 Project Structure

```text
Project-Flow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 👨‍💻 Author

**Kuber**

* GitHub: [@kuber0007](https://github.com/kuber0007)

---

<div align="center">

**ProjectFlow — organize work. collaborate better.**

</div>
