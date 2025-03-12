import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Database } from '../../types/supabase';
import { truncateText } from '../../lib/utils';

type Course = Database['public']['Tables']['courses']['Row'];

interface CourseCardProps {
  course: Course;
  instructorName?: string;
  enrollmentCount?: number;
  lessonCount?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  instructorName, 
  enrollmentCount = 0,
  lessonCount = 0
}) => {
  return (
    <Card hoverable className="h-full flex flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <img 
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'} 
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          {course.price === 0 ? 'FREE' : `$${course.price}`}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{course.title}</h3>
          {instructorName && (
            <p className="text-white/80 text-sm">{instructorName}</p>
          )}
        </div>
      </div>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm">
          {truncateText(course.description, 120)}
        </p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
          {enrollmentCount > 0 && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{enrollmentCount} students</span>
            </div>
          )}
          
          {lessonCount > 0 && (
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{lessonCount} lessons</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4">
        <Link 
          to={`/courses/${course.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Course →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;