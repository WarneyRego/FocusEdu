/*
  # Create Study Plans Schema

  1. New Tables
    - `study_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subjects` (text array)
      - `hours_per_day` (integer)
      - `schedule` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on study_plans table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subjects text[] NOT NULL,
  hours_per_day integer NOT NULL CHECK (hours_per_day > 0),
  schedule jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own study plans"
  ON study_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans"
  ON study_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
  ON study_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
  ON study_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);