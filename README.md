# 🚀 Team Performance Tracker - MERN Stack App

A powerful MERN stack web application built with **Node.js** and **React.js** featuring a **User Panel** and an **Admin Panel** to track and review daily team member performance.

---

## ✨ Features

### 👤 User Panel
- 🔐 User Authentication (JWT-based)
- 🕓 Fill Daily Form:
  - Arrival Time
  - Departure Time
  - Work Summary
- 📆 View personal submission history

### 🚰 Admin Panel
- 👀 View all team member submissions
- 📝 Add Ratings and Comments
- 📊 Review performance reports
- 🔍 Filter by date or user (optional)
- 📅 Export/Print reports (optional)

---

## 🛠️ Tech Stack

**Frontend**:  
- React.js  
- Axios  
- React Router DOM  

**Backend**:  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT for Auth  
- Bcrypt for Password Encryption  

---

## 📂 Project Structure

```bash
.
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context or redux
│   │   └── App.js
├── .env
└── README.md
```

---

## 🧪 Getting Started

### 📅 Clone the repo
```bash
git clone https://github.com/your-username/team-performance-tracker.git
cd team-performance-tracker
```

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

- Secure user registration and login
- JWT token stored in localStorage
- Protected routes for users and admins

---

## ✅ To-Do (Upcoming Features)

- [ ] Filter submissions by date/user
- [ ] Export/print reports
- [ ] Email notifications/reminders
- [ ] Dark mode 🌙

---

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change. ❤️

---

## 📓 License

This project is licensed under the FK License.

---

## 📞 Contact

Made with 💙 by Muhammad Abdullah Awais 