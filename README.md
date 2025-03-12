# EduLearn - E-learning Platform
![image](https://github.com/user-attachments/assets/b82b5116-2ff0-466e-9f25-c72dc4512381)

EduLearn is a comprehensive online learning platform that offers a wide range of courses taught by expert instructors. The platform provides interactive learning experiences, progress tracking, and certification upon course completion.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Quality Content**: Courses designed by industry experts with real-world applications.
- **Interactive Learning**: Engage with instructors and peers through discussion forums.
- **Certificates**: Earn certificates upon course completion to showcase your skills.
- **Progress Tracking**: Monitor your learning journey with detailed progress analytics.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Unique Identifiers**: uuid
- **Build Tool**: Vite
- **Linting**: ESLint
- **Testing**: Jest (if applicable)
- **Backend**: Supabase (mocked with localStorage for demo purposes)

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/e-learning-platform.git
   cd e-learning-platform
   npm install
# or
  yarn install
  d:\projects\E-learning\
  
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── [AuthForm.tsx](http://_vscodecontentref_/2)
│   │   ├── courses/
│   │   │   ├── [CourseCard.tsx](http://_vscodecontentref_/3)
│   │   │   └── [CourseList.tsx](http://_vscodecontentref_/4)
│   │   ├── layout/
│   │   │   ├── [Footer.tsx](http://_vscodecontentref_/5)
│   │   │   └── [Navbar.tsx](http://_vscodecontentref_/6)
│   │   ├── navigation/
│   │   │   └── [Breadcrumbs.tsx](http://_vscodecontentref_/7)
│   │   ├── search/
│   │   │   └── [SearchBar.tsx](http://_vscodecontentref_/8)
│   │   ├── seo/
│   │   │   └── [MetaTags.tsx](http://_vscodecontentref_/9)
│   │   └── ui/
│   │       ├── [Button.tsx](http://_vscodecontentref_/10)
│   │       ├── [Card.tsx](http://_vscodecontentref_/11)
│   │       └── [Input.tsx](http://_vscodecontentref_/12)
│   ├── lib/
│   │   ├── [localStorage.ts](http://_vscodecontentref_/13)
│   │   ├── [store.ts](http://_vscodecontentref_/14)
│   │   ├── [supabase.ts](http://_vscodecontentref_/15)
│   │   └── [utils.ts](http://_vscodecontentref_/16)
│   ├── pages/
│   │   ├── [AuthPage.tsx](http://_vscodecontentref_/17)
│   │   ├── [CoursesPage.tsx](http://_vscodecontentref_/18)
│   │   ├── [DashboardPage.tsx](http://_vscodecontentref_/19)
│   │   ├── [HomePage.tsx](http://_vscodecontentref_/20)
│   │   └── [InstructorDashboardPage.tsx](http://_vscodecontentref_/21)
│   ├── styles/
│   │   └── [theme.ts](http://_vscodecontentref_/22)
│   ├── [App.tsx](http://_vscodecontentref_/23)
│   ├── [index.css](http://_vscodecontentref_/24)
│   ├── [main.tsx](http://_vscodecontentref_/25)
│   └── [vite-env.d.ts](http://_vscodecontentref_/26)
├── [.env.example](http://_vscodecontentref_/27)
