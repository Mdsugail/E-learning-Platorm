import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuthStore } from '../../lib/store';

type FormData = {
  email: string;
  password: string;
  fullName?: string;
  role?: 'student' | 'instructor';
};

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, loading, error } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    if (isLogin) {
      await signIn(data.email, data.password);
    } else {
      if (data.fullName && data.role) {
        await signUp(data.email, data.password, data.fullName, data.role);
      }
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                fullWidth
                {...register('fullName', { required: !isLogin })}
                error={errors.fullName?.message}
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  I want to join as
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="student"
                      {...register('role', { required: !isLogin })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Student</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="instructor"
                      {...register('role', { required: !isLogin })}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Instructor</span>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-500">Please select a role</p>
                )}
              </div>
            </>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            fullWidth
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password?.message}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={loading}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;