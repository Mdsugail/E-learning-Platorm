import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import { useAuthStore } from './lib/store';

function App() {
  const { getUser } = useAuthStore();
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;