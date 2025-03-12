import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { PlusCircle, Users, BookOpen, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CourseCard from '../components/courses/CourseCard';
import { useAuthStore, useCourseStore } from '../lib/store';
import { supabase } from '../lib/supabase';

const InstructorDashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuthStore();
  const { instructorCourses, fetchInstructorCourses, loading: coursesLoading } = useCourseStore();
  
  useEffect(() => {
    if (user && user.role === 'instructor') {
      fetchInstructorCourses(user.id);
    }
  }, [user, fetchInstructorCourses]);
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.role !== 'instructor') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Instructor Dashboard</h1>
        <Button 
          leftIcon={<PlusCircle className="h-4 w-4" />}
          onClick={() => window.location.href = '/instructor/courses/new'}
        >
          Create New Course
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instructorCourses.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Courses created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Students enrolled in your courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $0.00
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* My Courses */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>
        
        {coursesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : instructorCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't created any courses yet</h3>
            <p className="text-gray-500 mb-6">Start creating your first course to share your knowledge with students.</p>
            <Button 
              onClick={() => window.location.href = '/instructor/courses/new'}
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboardPage;