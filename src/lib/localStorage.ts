import { v4 as uuidv4 } from 'uuid';
import { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];
type Module = Database['public']['Tables']['modules']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];

// Initialize local storage with default data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('modules')) {
    localStorage.setItem('modules', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('lessons')) {
    localStorage.setItem('lessons', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('enrollments')) {
    localStorage.setItem('enrollments', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('lesson_progress')) {
    localStorage.setItem('lesson_progress', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('quiz_attempts')) {
    localStorage.setItem('quiz_attempts', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('currentSession')) {
    localStorage.setItem('currentSession', JSON.stringify(null));
  }
};

// Initialize on import
initializeLocalStorage();

// User functions
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const createUser = (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): User => {
  const users = getUsers();
  const now = new Date().toISOString();
  
  const newUser: User = {
    id: uuidv4(),
    ...userData,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    updated_at: new Date().toISOString()
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem('users', JSON.stringify(users));
  
  return updatedUser;
};

// Session functions
export const getCurrentSession = () => {
  return JSON.parse(localStorage.getItem('currentSession') || 'null');
};

export const setCurrentSession = (session: any) => {
  localStorage.setItem('currentSession', JSON.stringify(session));
};

export const clearCurrentSession = () => {
  localStorage.setItem('currentSession', JSON.stringify(null));
};

// Course functions
export const getCourses = (): Course[] => {
  return JSON.parse(localStorage.getItem('courses') || '[]');
};

export const getCourseById = (id: string): Course | null => {
  const courses = getCourses();
  return courses.find(course => course.id === id) || null;
};

export const getCoursesByInstructor = (instructorId: string): Course[] => {
  const courses = getCourses();
  return courses.filter(course => course.instructor_id === instructorId);
};

export const createCourse = (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Course => {
  const courses = getCourses();
  const now = new Date().toISOString();
  
  const newCourse: Course = {
    id: uuidv4(),
    ...courseData,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('courses', JSON.stringify([...courses, newCourse]));
  return newCourse;
};

export const updateCourse = (id: string, courseData: Partial<Course>): Course | null => {
  const courses = getCourses();
  const courseIndex = courses.findIndex(course => course.id === id);
  
  if (courseIndex === -1) return null;
  
  const updatedCourse = {
    ...courses[courseIndex],
    ...courseData,
    updated_at: new Date().toISOString()
  };
  
  courses[courseIndex] = updatedCourse;
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return updatedCourse;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  
  if (filteredCourses.length === courses.length) return false;
  
  localStorage.setItem('courses', JSON.stringify(filteredCourses));
  return true;
};

// Module functions
export const getModules = (): Module[] => {
  return JSON.parse(localStorage.getItem('modules') || '[]');
};

export const getModulesByCourse = (courseId: string): Module[] => {
  const modules = getModules();
  return modules.filter(module => module.course_id === courseId);
};

export const createModule = (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Module => {
  const modules = getModules();
  const now = new Date().toISOString();
  
  const newModule: Module = {
    id: uuidv4(),
    ...moduleData,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('modules', JSON.stringify([...modules, newModule]));
  return newModule;
};

// Lesson functions
export const getLessons = (): Lesson[] => {
  return JSON.parse(localStorage.getItem('lessons') || '[]');
};

export const getLessonsByModule = (moduleId: string): Lesson[] => {
  const lessons = getLessons();
  return lessons.filter(lesson => lesson.module_id === moduleId);
};

export const createLesson = (lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Lesson => {
  const lessons = getLessons();
  const now = new Date().toISOString();
  
  const newLesson: Lesson = {
    id: uuidv4(),
    ...lessonData,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('lessons', JSON.stringify([...lessons, newLesson]));
  return newLesson;
};

// Enrollment functions
export const getEnrollments = (): Enrollment[] => {
  return JSON.parse(localStorage.getItem('enrollments') || '[]');
};

export const getEnrollmentsByUser = (userId: string): Enrollment[] => {
  const enrollments = getEnrollments();
  return enrollments.filter(enrollment => enrollment.user_id === userId);
};

export const getEnrollmentsByCourse = (courseId: string): Enrollment[] => {
  const enrollments = getEnrollments();
  return enrollments.filter(enrollment => enrollment.course_id === courseId);
};

export const createEnrollment = (userId: string, courseId: string): Enrollment => {
  const enrollments = getEnrollments();
  const now = new Date().toISOString();
  
  // Check if enrollment already exists
  const existingEnrollment = enrollments.find(
    e => e.user_id === userId && e.course_id === courseId
  );
  
  if (existingEnrollment) return existingEnrollment;
  
  const newEnrollment: Enrollment = {
    id: uuidv4(),
    user_id: userId,
    course_id: courseId,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('enrollments', JSON.stringify([...enrollments, newEnrollment]));
  return newEnrollment;
};

export const deleteEnrollment = (userId: string, courseId: string): boolean => {
  const enrollments = getEnrollments();
  const filteredEnrollments = enrollments.filter(
    e => !(e.user_id === userId && e.course_id === courseId)
  );
  
  if (filteredEnrollments.length === enrollments.length) return false;
  
  localStorage.setItem('enrollments', JSON.stringify(filteredEnrollments));
  return true;
};

// Lesson progress functions
export const getLessonProgress = (): LessonProgress[] => {
  return JSON.parse(localStorage.getItem('lesson_progress') || '[]');
};

export const getLessonProgressByUser = (userId: string): LessonProgress[] => {
  const progress = getLessonProgress();
  return progress.filter(p => p.user_id === userId);
};

export const getLessonProgressByUserAndLesson = (userId: string, lessonId: string): LessonProgress | null => {
  const progress = getLessonProgress();
  return progress.find(p => p.user_id === userId && p.lesson_id === lessonId) || null;
};

export const createOrUpdateLessonProgress = (userId: string, lessonId: string, completed: boolean): LessonProgress => {
  const progress = getLessonProgress();
  const now = new Date().toISOString();
  
  const existingIndex = progress.findIndex(
    p => p.user_id === userId && p.lesson_id === lessonId
  );
  
  if (existingIndex !== -1) {
    // Update existing progress
    const updatedProgress = {
      ...progress[existingIndex],
      completed,
      updated_at: now
    };
    
    progress[existingIndex] = updatedProgress;
    localStorage.setItem('lesson_progress', JSON.stringify(progress));
    
    return updatedProgress;
  } else {
    // Create new progress
    const newProgress: LessonProgress = {
      id: uuidv4(),
      user_id: userId,
      lesson_id: lessonId,
      completed,
      created_at: now,
      updated_at: now
    };
    
    localStorage.setItem('lesson_progress', JSON.stringify([...progress, newProgress]));
    return newProgress;
  }
};

// Quiz attempt functions
export const getQuizAttempts = (): QuizAttempt[] => {
  return JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
};

export const getQuizAttemptsByUser = (userId: string): QuizAttempt[] => {
  const attempts = getQuizAttempts();
  return attempts.filter(a => a.user_id === userId);
};

export const createQuizAttempt = (userId: string, quizId: string, score: number): QuizAttempt => {
  const attempts = getQuizAttempts();
  const now = new Date().toISOString();
  
  const newAttempt: QuizAttempt = {
    id: uuidv4(),
    user_id: userId,
    quiz_id: quizId,
    score,
    created_at: now,
    updated_at: now
  };
  
  localStorage.setItem('quiz_attempts', JSON.stringify([...attempts, newAttempt]));
  return newAttempt;
};

// Helper functions for getting enrolled courses
export const getEnrolledCourses = (userId: string): Course[] => {
  const enrollments = getEnrollmentsByUser(userId);
  const courses = getCourses();
  
  return enrollments
    .map(enrollment => courses.find(course => course.id === enrollment.course_id))
    .filter((course): course is Course => course !== undefined);
};

// Add some sample data
export const addSampleData = () => {
  // Check if we already have data
  const users = getUsers();
  const courses = getCourses();
  
  if (users.length > 0 || courses.length > 0) {
    return; // Don't add sample data if we already have some
  }
  
  // Create sample users
  const instructor1 = createUser({
    email: 'instructor@example.com',
    full_name: 'John Instructor',
    avatar_url: null,
    role: 'instructor'
  });
  
  const student1 = createUser({
    email: 'student@example.com',
    full_name: 'Jane Student',
    avatar_url: null,
    role: 'student'
  });
  
  // Create sample courses
  const course1 = createCourse({
    title: 'Introduction to JavaScript',
    description: 'Learn the fundamentals of JavaScript programming language.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 0,
    category: 'Programming',
    instructor_id: instructor1.id
  });
  
  const course2 = createCourse({
    title: 'React for Beginners',
    description: 'Start building modern web applications with React.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 29.99,
    category: 'Programming',
    instructor_id: instructor1.id
  });
  
  const course3 = createCourse({
    title: 'UI/UX Design Principles',
    description: 'Learn the core principles of creating effective user interfaces.',
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 19.99,
    category: 'Design',
    instructor_id: instructor1.id
  });
  
  // Create modules for course 1
  const module1 = createModule({
    title: 'JavaScript Basics',
    course_id: course1.id,
    position: 1
  });
  
  const module2 = createModule({
    title: 'Functions and Objects',
    course_id: course1.id,
    position: 2
  });
  
  // Create lessons for module 1
  const lesson1 = createLesson({
    title: 'Variables and Data Types',
    description: 'Learn about variables and different data types in JavaScript.',
    video_url: 'https://example.com/video1.mp4',
    pdf_url: null,
    module_id: module1.id,
    position: 1
  });
  
  const lesson2 = createLesson({
    title: 'Operators and Expressions',
    description: 'Understand operators and expressions in JavaScript.',
    video_url: 'https://example.com/video2.mp4',
    pdf_url: null,
    module_id: module1.id,
    position: 2
  });
  
  // Enroll student in course
  createEnrollment(student1.id, course1.id);
  
  // Create lesson progress
  createOrUpdateLessonProgress(student1.id, lesson1.id, true);
};

// Add sample data on initialization
addSampleData();