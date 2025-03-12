import React from 'react';
import CourseList from '../components/courses/CourseList';

const CoursesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Our Courses</h1>
        <p className="text-gray-600">
          Discover a wide range of courses taught by expert instructors to help you achieve your goals.
        </p>
      </div>
      
      <CourseList />
    </div>
  );
};

export default CoursesPage;