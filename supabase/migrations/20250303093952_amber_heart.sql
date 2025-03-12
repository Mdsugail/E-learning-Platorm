/*
  # Initial Schema for E-Learning Platform

  1. New Tables
    - `users` - Stores user information with role-based access
    - `courses` - Stores course information
    - `modules` - Stores module information for courses
    - `lessons` - Stores lesson information for modules
    - `quizzes` - Stores quiz information for lessons
    - `quiz_questions` - Stores questions for quizzes
    - `enrollments` - Tracks student enrollments in courses
    - `lesson_progress` - Tracks student progress through lessons
    - `quiz_attempts` - Tracks student quiz attempts and scores
    - `forum_posts` - Stores discussion forum posts
    - `forum_comments` - Stores comments on forum posts
    - `votes` - Tracks upvotes and downvotes on forum comments
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on their roles
*/

-- Create users table that extends the auth.users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  pdf_url TEXT,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create forum comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Courses table policies
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create courses"
  ON courses
  FOR INSERT
  WITH CHECK (
    auth.uid() = instructor_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'instructor')
  );

CREATE POLICY "Instructors can update their own courses"
  ON courses
  FOR UPDATE
  USING (
    auth.uid() = instructor_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'instructor')
  );

CREATE POLICY "Instructors can delete their own courses"
  ON courses
  FOR DELETE
  USING (
    auth.uid() = instructor_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'instructor')
  );

-- Modules table policies
CREATE POLICY "Anyone can view modules"
  ON modules
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create modules for their courses"
  ON modules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update modules for their courses"
  ON modules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can delete modules for their courses"
  ON modules
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Lessons table policies
CREATE POLICY "Anyone can view lessons"
  ON lessons
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create lessons for their modules"
  ON lessons
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON modules.course_id = courses.id
      WHERE modules.id = module_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update lessons for their modules"
  ON lessons
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON modules.course_id = courses.id
      WHERE modules.id = module_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can delete lessons for their modules"
  ON lessons
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM modules
      JOIN courses ON modules.course_id = courses.id
      WHERE modules.id = module_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Quizzes table policies
CREATE POLICY "Anyone can view quizzes"
  ON quizzes
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create quizzes for their lessons"
  ON quizzes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE lessons.id = lesson_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update quizzes for their lessons"
  ON quizzes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE lessons.id = lesson_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can delete quizzes for their lessons"
  ON quizzes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE lessons.id = lesson_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Quiz questions table policies
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can create quiz questions for their quizzes"
  ON quiz_questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN lessons ON quizzes.lesson_id = lessons.id
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE quizzes.id = quiz_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update quiz questions for their quizzes"
  ON quiz_questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN lessons ON quizzes.lesson_id = lessons.id
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE quizzes.id = quiz_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can delete quiz questions for their quizzes"
  ON quiz_questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN lessons ON quizzes.lesson_id = lessons.id
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE quizzes.id = quiz_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Enrollments table policies
CREATE POLICY "Students can view their enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can enroll in courses"
  ON enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can unenroll from courses"
  ON enrollments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Lesson progress table policies
CREATE POLICY "Students can view their lesson progress"
  ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their lesson progress"
  ON lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can mark lessons as completed"
  ON lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz attempts table policies
CREATE POLICY "Students can view their quiz attempts"
  ON quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can submit quiz attempts"
  ON quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Forum posts table policies
CREATE POLICY "Anyone can view forum posts"
  ON forum_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum posts"
  ON forum_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts"
  ON forum_posts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum posts"
  ON forum_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Forum comments table policies
CREATE POLICY "Anyone can view forum comments"
  ON forum_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum comments"
  ON forum_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum comments"
  ON forum_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum comments"
  ON forum_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Votes table policies
CREATE POLICY "Users can view votes"
  ON votes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their votes"
  ON votes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes"
  ON votes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON modules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON quizzes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
BEFORE UPDATE ON quiz_questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
BEFORE UPDATE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at
BEFORE UPDATE ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at
BEFORE UPDATE ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at
BEFORE UPDATE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();