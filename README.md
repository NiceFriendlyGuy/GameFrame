# 🎮 GameFrame  

A simple **full-stack game quiz platform** built with **Angular 20, Node.js, and MongoDB**, integrating the **IGDB API** for dynamic game data.  
This project demonstrates **scalable architecture, modern Angular practices, and secure backend integration** — designed as both a technical challenge and a showcase project.  

---

## 💡 Project Overview  

- **Purpose:** A lightweight, interactive app for daily polls and quizzes.  
- **Value:** Demonstrates integration of a third-party API (IGDB), JWT-secured role management, and multi-app deployment (user & admin).  
- **My Role:**  
  - Designed the **full architecture** (frontend, backend, DB, deployment).  
  - Implemented the **Angular 20 frontend** with Signals and modern control flow.  
  - Built the **admin dashboard** for poll management.  
  - Connected and optimized **IGDB API calls**.  
  - Deployed backend + frontend in a **production-ready setup**.  

---

## 🚀 Key Features  

### 🔹 Frontend (Angular 20)  
- Latest Angular 20 structure and practices using Signals for reactivity.  
- Game search using IGDB's database for screenshot previews.  
- User-friendly with progress saving (with login or with local storage).  
- Uses of Angular Material (datepicker for scheduling).  

### 🔹 Admin Dashboard  
- Create, edit, and schedule polls with a calendar.  
- View aggregated statistics.  
- Secure role-based access (Admin vs User).  

### 🔹 Backend (Node.js + Express)  
- JWT authentication for secure role handling.  
- REST API with modular controllers and services.  
- IGDB API integration (covers and screenshots).  
- Deployed with environment-based configuration.  

### 🔹 Database (MongoDB)  
- Stores questions, users and answers.  
- Dockerized local development & MongoDB Atlas for production.  

---

## 🛠️ Tech Highlights  

- **Angular 20** – signals, computed/effect, standalone components.  
- **Node.js + Express** – structured REST API with controllers.  
- **MongoDB** – containerized via Docker for local dev.  
- **JWT Auth** – token-based authentication & authorization.  
- **IGDB API** – third-party API integration with caching & filtering.  
- **Deployment** – split architecture (frontend, admin, backend) with scalable setup.  

---

## 📂 Architecture  

angular-polling-app/

│── frontend-users/ 

│── frontend-admin/ 

│── backend/ 

│── README.md 

#### Note that frontend is a deprecated folder of the now frontend-users made with angular 19. It won't function properly.

---

## ⚙️ Setup (Dev Environment)
### Clone repo
git clone https://github.com/NiceFriendlyGuy/GameFrame.git
cd GameFrame


#### Backend

cd backend
npm install
npm run dev    or   docker compose up -d --build


#### Frontend-users

cd frontend-users
npm install
ng serve


#### Admin Dashboard

cd frontend-admin
npm install
ng serve


#### MongoDB (via Docker)

docker run --name polls-mongo -p 27017:27017 -d mongo

---

## 📊 Why This Project Matters

✅ Demonstrates modern Angular best practices (Signals, control flow).

✅ Showcases full-stack capability (frontend, backend, database).

✅ Highlights API integration (IGDB).

✅ Proves ability to design, build, and deploy production-ready apps.

✅ Emphasizes modularity and scalability (separate apps, Dockerized DB).

---

## 📸 Demo

Live App: GameFrame.ch

---

## 📜 License

MIT License.
