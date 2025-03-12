import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import CourseCard from './CourseCard';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCourseStore } from '../../lib/store';
import * as localStorage from '../../lib/localStorage';
import { Database } from '../../types/supabase';

type Course = Database['public']['Tables']['courses']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface CourseWithDetails extends Course {
  instructor?: User;
  enrollmentCount: number;
  lessonCount: number;
}

const CourseList: React.FC = () => {
  const { courses, fetchCourses, loading } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [coursesWithDetails, setCoursesWithDetails] = useState<CourseWithDetails[]>([]);
  
  const categories = [
    'All Categories',
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Personal Development'
  ];
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (courses.length === 0) return;
      
      const coursesWithDetailsPromises = courses.map(async (course) => {
        // Fetch instructor
        const instructor = localStorage.getUserById(course.instructor_id);
          
        // Fetch enrollment count
        const enrollments = localStorage.getEnrollmentsByCourse(course.id);
        const enrollmentCount = enrollments.length;
          
        // Fetch lesson count
        const modules = localStorage.getModulesByCourse(course.id);
        
        let lessonCount = 0;
        
        if (modules && modules.length > 0) {
          for (const module of modules) {
            const lessons = localStorage.getLessonsByModule(module.id);
            lessonCount += lessons.length;
          }
        }
        
        return {
          ...course,
          instructor: instructor || undefined,
          enrollmentCount,
          lessonCount
        };
      });
      
      const detailedCourses = await Promise.all(coursesWithDetailsPromises);
      setCoursesWithDetails(detailedCourses);
    };
    
    fetchCourseDetails();
  }, [courses]);
  
  const filteredCourses = coursesWithDetails.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
                            selectedCategory === 'All Categories' || 
                            course.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructorName={course.instructor?.full_name}
              enrollmentCount={course.enrollmentCount}
              lessonCount={course.lessonCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;