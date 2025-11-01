/*
  # KrishiQuest Core Database Schema
  
  ## Overview
  This migration creates the core tables for the KrishiQuest farming application,
  enabling automatic field tracking, community features, and user profiles.
  
  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact number
  - `location` (text) - Farm location
  - `farm_size` (text) - Size of farm
  - `primary_crops` (text) - Main crops grown
  - `avatar_url` (text, nullable) - Profile picture URL
  - `total_points` (integer) - Reward points earned
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last profile update
  
  ### `fields`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Owner of the field
  - `name` (text) - Field name
  - `size_acres` (numeric) - Field size in acres
  - `soil_condition` (text) - Soil quality assessment
  - `moisture_level` (integer) - Moisture percentage
  - `image_url` (text, nullable) - Latest scan image
  - `location` (text) - Field location
  - `current_stage` (text) - Current farming stage
  - `last_scanned_at` (timestamptz) - Last scan timestamp
  - `created_at` (timestamptz) - Field creation date
  - `updated_at` (timestamptz) - Last update
  
  ### `field_scans`
  - `id` (uuid, primary key)
  - `field_id` (uuid) - Reference to field
  - `user_id` (uuid) - User who performed scan
  - `scan_type` (text) - Type of scan (initial, verification)
  - `detected_stage` (text) - AI-detected farming stage
  - `image_url` (text) - Scan image URL
  - `moisture_level` (integer) - Detected moisture
  - `soil_condition` (text) - Detected soil condition
  - `recommendations` (jsonb) - AI recommendations
  - `verified` (boolean) - Verification status
  - `created_at` (timestamptz) - Scan timestamp
  
  ### `community_posts`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Post author
  - `content` (text) - Post content
  - `tags` (text[]) - Array of tags
  - `image_url` (text, nullable) - Optional image
  - `likes_count` (integer) - Number of likes
  - `comments_count` (integer) - Number of comments
  - `created_at` (timestamptz) - Post creation time
  - `updated_at` (timestamptz) - Last update
  
  ### `post_likes`
  - `id` (uuid, primary key)
  - `post_id` (uuid) - Reference to post
  - `user_id` (uuid) - User who liked
  - `created_at` (timestamptz) - Like timestamp
  
  ### `post_comments`
  - `id` (uuid, primary key)
  - `post_id` (uuid) - Reference to post
  - `user_id` (uuid) - Comment author
  - `content` (text) - Comment text
  - `created_at` (timestamptz) - Comment timestamp
  - `updated_at` (timestamptz) - Last update
  
  ### `tasks`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Task owner
  - `field_id` (uuid, nullable) - Related field
  - `title` (text) - Task title
  - `description` (text) - Task description
  - `task_type` (text) - Type (plough, sow, water, harvest)
  - `points` (integer) - Points reward
  - `completed` (boolean) - Completion status
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `created_at` (timestamptz) - Task creation
  
  ### `achievements`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Achievement owner
  - `title` (text) - Achievement title
  - `description` (text) - Description
  - `progress` (integer) - Current progress
  - `max_progress` (integer) - Target progress
  - `unlocked` (boolean) - Unlock status
  - `unlocked_at` (timestamptz, nullable) - Unlock timestamp
  - `created_at` (timestamptz) - Creation time
  
  ## Security
  
  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Users can read their own data
  - Users can update their own data
  - Community posts are publicly readable
  - Only post owners can update/delete their posts
  - Post likes and comments are publicly readable
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  location text,
  farm_size text,
  primary_crops text,
  avatar_url text,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  size_acres numeric DEFAULT 0,
  soil_condition text DEFAULT 'Unknown',
  moisture_level integer DEFAULT 50,
  image_url text,
  location text,
  current_stage text DEFAULT 'empty',
  last_scanned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own fields"
  ON fields FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fields"
  ON fields FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fields"
  ON fields FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fields"
  ON fields FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create field_scans table
CREATE TABLE IF NOT EXISTS field_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type text NOT NULL DEFAULT 'verification',
  detected_stage text NOT NULL,
  image_url text,
  moisture_level integer DEFAULT 50,
  soil_condition text DEFAULT 'Good',
  recommendations jsonb DEFAULT '[]'::jsonb,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE field_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own field scans"
  ON field_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own field scans"
  ON field_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read post likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  field_id uuid REFERENCES fields(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  task_type text NOT NULL,
  points integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  progress integer DEFAULT 0,
  max_progress integer NOT NULL,
  unlocked boolean DEFAULT false,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_field_scans_field_id ON field_scans(field_id);
CREATE INDEX IF NOT EXISTS idx_field_scans_user_id ON field_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON fields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-update post counts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for post counts
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();
