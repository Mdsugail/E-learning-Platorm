// This file is kept for compatibility, but we're not using Supabase anymore
// All data is stored in localStorage

import { Database } from '../types/supabase';

// Create a mock supabase client that uses localStorage
export const supabase = {
  auth: {
    signUp: async () => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null })
  },
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        in: (column: string, values: any[]) => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      in: (column: string, values: any[]) => ({
        single: async () => ({ data: null, error: null }),
      }),
      count: (options: any) => ({ data: null, count: 0, error: null }),
    }),
    insert: (data: any) => ({
      select: async () => ({ data: null, error: null }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: async () => ({ data: null, error: null }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        select: async () => ({ data: null, error: null }),
      }),
    }),
  }),
};