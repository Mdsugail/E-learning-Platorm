# EduLearn - Interactive E-Learning Platform
![image](https://github.com/user-attachments/assets/b82b5116-2ff0-466e-9f25-c72dc4512381)
## Project Documentation

### 1. Project Overview

EduLearn is an interactive e-learning platform that offers courses designed by industry experts. This project follows DevOps best practices by integrating CI/CD pipelines, containerization, and monitoring to ensure reliability and scalability.

## 🚀 Table of Contents

- ✨ Features
- 🛠 Technologies Used
- 📌 DevOps Workflow
- 🚀 Getting Started
- 📂 Project Structure
- 📜 Available Scripts
- 🤝 Contributing
- 📄 License

### ✨ Features

- ✅ Expert-Curated Courses
- ✅ Interactive Learning (Q&A, Discussions)
- ✅ Progress Tracking
- ✅ Certificates Upon Completion
- ✅ CI/CD Pipeline for Auto Deployment
- ✅ Docker Support for Easy Deployment
- ✅ Monitoring & Logging with Prometheus & Grafana

### 🛠 Technologies Used

| Category           | Technology            |
|-------------------|----------------------|
| Frontend         | React, TypeScript, Vite |
| State Management | Zustand               |
| Styling         | Tailwind CSS           |
| Routing         | React Router           |
| Authentication  | Supabase (mocked with localStorage) |
| CI/CD           | GitHub Actions         |
| Deployment      | GitHub Pages / Vercel  |

### 📌 DevOps Workflow

#### 🔹 Phase 1: Project Setup & GitHub Management ✅ (Completed)
- ✅ GitHub Repository setup
- ✅ GitHub Projects (Kanban Board) for issue tracking
- ✅ Branching Strategy: main, dev, feature/*

#### 🔹 Phase 2: CI/CD Pipeline (Automation) - In Progress 🚀
- ✅ Continuous Integration (CI):
  - Automated testing using Jest & ESLint
  - Build & test on every git push
- ✅ Continuous Deployment (CD):
  - Deploy Frontend to GitHub Pages / Vercel
  - Use GitHub Secrets for secure environment variables

#### 🔹 Phase 3: Containerization & Orchestration (Coming Soon) 🐳
- ✅ Dockerize the frontend for easy deployment
- ✅ Use Docker Compose if backend is added
- ✅ Optional: Kubernetes for scaling

#### 🔹 Phase 4: Monitoring & Logging (Future Work) 📊
- ✅ Setup Prometheus & Grafana for monitoring
- ✅ Logging & alerts for better debugging

### 🚀 Getting Started

#### Prerequisites
Ensure you have the following installed:
- 🔹 Node.js (>=14.x)
- 🔹 npm or yarn
- 🔹 Docker (if using containers)

#### Installation

1️⃣ Clone the repository:
```sh
git clone https://github.com/your-username/e-learning-platform.git
cd e-learning-platform
```

2️⃣ Install dependencies:
```sh
npm install
# or
yarn install
```

3️⃣ Start the development server:
```sh
npm run dev
```

### 📂 Project Structure

```bash
E-learning/
├── src/
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Utilities & API calls
│   ├── pages/                   # Application pages
│   ├── styles/                  # Theme and global styles
│   ├── App.tsx                  # Main application entry
│   ├── main.tsx                 # React entry file
│   ├── vite-env.d.ts             # TypeScript definitions
├── .github/workflows/            # GitHub Actions for CI/CD
├── Dockerfile                    # Docker configuration
├── .env.example                  # Environment variables example
```

### 📜 Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint
- `docker build -t edulearn .` – Build Docker image
- `docker run -p 3000:3000 edulearn` – Run container

### 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request 🎉

### 📄 License

This project is open-source and available under the MIT License.
