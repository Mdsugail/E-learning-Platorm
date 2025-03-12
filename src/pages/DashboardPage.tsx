import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BookOpen, Clock, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CourseCard from '../components/courses/CourseCard';
import { useAuthStore, useCourseStore } from '../lib/store';
import * as localStorage from '../lib/localStorage';
import { calculateProgress } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuthStore();
  const { enrolledCourses, fetchEnrolledCourses, loading: coursesLoading } = useCourseStore();
  
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalLessons: 0,
    completedCourses: 0,
    quizScores: [] as number[]
  });
  
  useEffect(() => {
    if (user) {
      fetchEnrolledCourses(user.id);
    }
  }, [user, fetchEnrolledCourses]);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || enrolledCourses.length === 0) return;
      
      try {
        // Get all modules for enrolled courses
        const courseIds = enrolledCourses.map(course => course.id);
        let allModules = [];
        
        for (const courseId of courseIds) {
          const modules = localStorage.getModulesByCourse(courseId);
          allModules = [...allModules, ...modules];
        }
        
        if (allModules.length === 0) return;
        
        const moduleIds = allModules.map(module => module.id);
        
        // Get all lessons for these modules
        let allLessons = [];
        
        for (const moduleId of moduleIds) {
          const lessons = localStorage.getLessonsByModule(moduleId);
          allLessons = [...allLessons, ...lessons];
        }
        
        if (allLessons.length === 0) return;
        
        const lessonIds = allLessons.map(lesson => lesson.id);
        
        // Get completed lessons
        let completedLessonsCount = 0;
        
        for (const lessonId of lessonIds) {
          const progress = localStorage.getLessonProgressByUserAndLesson(user.id, lessonId);
          if (progress && progress.completed) {
            completedLessonsCount++;
          }
        }
        
        // Get quiz attempts
        const quizAttempts = localStorage.getQuizAttemptsByUser(user.id);
        
        // Calculate completed courses (if all lessons in a course are completed)
        let completedCoursesCount = 0;
        
        for (const course of enrolledCourses) {
          const courseModules = localStorage.getModulesByCourse(course.id);
          
          if (courseModules.length === 0) continue;
          
          let courseLessons = [];
          
          for (const module of courseModules) {
            const lessons = localStorage.getLessonsByModule(module.id);
            courseLessons = [...courseLessons, ...lessons];
          }
          
          if (courseLessons.length === 0) continue;
          
          let allLessonsCompleted = true;
          
          for (const lesson of courseLessons) {
            const progress = localStorage.getLessonProgressByUserAndLesson(user.id, lesson.id);
            if (!progress || !progress.completed) {
              allLessonsCompleted = false;
              break;
            }
          }
          
          if (allLessonsCompleted) {
            completedCoursesCount++;
          }
        }
        
        setStats({
          completedLessons: completedLessonsCount,
          totalLessons: allLessons.length,
          completedCourses: completedCoursesCount,
          quizScores: quizAttempts.map(attempt => attempt.score)
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, [user, enrolledCourses]);
  
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
  
  const averageQuizScore = stats.quizScores.length > 0
    ? stats.quizScores.reduce((sum, score) => sum + score, 0) / stats.quizScores.length
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Course Progress</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateProgress(stats.completedLessons, stats.totalLessons)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.completedLessons} of {stats.totalLessons} lessons completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress(stats.completedLessons, stats.totalLessons)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Learning Time</CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedLessons * 15} mins
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total time spent learning
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Courses</CardTitle>
            <Award className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedCourses}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Out of {enrolledCourses.length} enrolled courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Quiz Performance</CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageQuizScore.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Average score across all quizzes
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Enrolled Courses */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>
        
        {coursesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">You haven't enrolled in any courses yet</h3>
            <p className="text-gray-500 mb-6">Browse our course catalog to find courses that interest you.</p>
            <Button 
              onClick={() => window.location.href = '/courses'}
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              <div className="p-4 flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">You completed a lesson</p>
                  <p className="text-sm text-gray-500">Introduction to React Hooks</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="p-4 flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">You passed a quiz</p>
                  <p className="text-sm text-gray-500">JavaScript Fundamentals Quiz</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>
              
              <div className="p-4 flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">You enrolled in a new course</p>
                  <p className="text-sm text-gray-500">Advanced CSS and Sass</p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;