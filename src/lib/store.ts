import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../types/supabase';
import * as localStorage from './localStorage';

type User = Database['public']['Tables']['users']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'instructor') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  signUp: async (email, password, fullName, role) => {
    try {
      set({ loading: true, error: null });
      
      // Check if user already exists
      const existingUser = localStorage.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = localStorage.createUser({
        email,
        full_name: fullName,
        role,
        avatar_url: null
      });
      
      // Create session
      const session = {
        user_id: newUser.id,
        email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setCurrentSession(session);
      
      set({ 
        user: newUser,
        session,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      // Find user by email
      const user = localStorage.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would check the password here
      // For this demo, we'll just accept any password
      
      // Create session
      const session = {
        user_id: user.id,
        email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setCurrentSession(session);
      
      set({ user, session, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      localStorage.clearCurrentSession();
      
      set({ user: null, session: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  getUser: async () => {
    try {
      set({ loading: true, error: null });
      
      const session = localStorage.getCurrentSession();
      
      if (session) {
        const user = localStorage.getUserById(session.user_id);
        
        if (user) {
          set({ user, session, loading: false });
          return;
        }
      }
      
      set({ user: null, session: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false, user: null, session: null });
    }
  },
}));

interface CourseState {
  courses: Course[];
  enrolledCourses: Course[];
  instructorCourses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchEnrolledCourses: (userId: string) => Promise<void>;
  fetchInstructorCourses: (instructorId: string) => Promise<void>;
  createCourse: (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (userId: string, courseId: string) => Promise<void>;
  unenrollFromCourse: (userId: string, courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  enrolledCourses: [],
  instructorCourses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });
      
      const courses = localStorage.getCourses();
      
      set({ courses, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  fetchEnrolledCourses: async (userId) => {
    try {
      set({ loading: true, error: null });
      
      const enrolledCourses = localStorage.getEnrolledCourses(userId);
      
      set({ enrolledCourses, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  fetchInstructorCourses: async (instructorId) => {
    try {
      set({ loading: true, error: null });
      
      const instructorCourses = localStorage.getCoursesByInstructor(instructorId);
      
      set({ instructorCourses, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createCourse: async (courseData) => {
    try {
      set({ loading: true, error: null });
      
      const newCourse = localStorage.createCourse(courseData);
      
      set(state => ({ 
        instructorCourses: [...state.instructorCourses, newCourse],
        courses: [...state.courses, newCourse],
        loading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateCourse: async (id, courseData) => {
    try {
      set({ loading: true, error: null });
      
      const updatedCourse = localStorage.updateCourse(id, courseData);
      
      if (!updatedCourse) {
        throw new Error('Course not found');
      }
      
      set(state => ({
        courses: state.courses.map(course => course.id === id ? updatedCourse : course),
        instructorCourses: state.instructorCourses.map(course => course.id === id ? updatedCourse : course),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteCourse: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const success = localStorage.deleteCourse(id);
      
      if (!success) {
        throw new Error('Course not found');
      }
      
      set(state => ({
        courses: state.courses.filter(course => course.id !== id),
        instructorCourses: state.instructorCourses.filter(course => course.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  enrollInCourse: async (userId, courseId) => {
    try {
      set({ loading: true, error: null });
      
      localStorage.createEnrollment(userId, courseId);
      
      // Refresh enrolled courses
      await get().fetchEnrolledCourses(userId);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  unenrollFromCourse: async (userId, courseId) => {
    try {
      set({ loading: true, error: null });
      
      const success = localStorage.deleteEnrollment(userId, courseId);
      
      if (!success) {
        throw new Error('Enrollment not found');
      }
      
      set(state => ({
        enrolledCourses: state.enrolledCourses.filter(course => course.id !== courseId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));