/*
      # Enable RLS and Add Read Policy to Users Table

      1. Security
        - Enabled Row Level Security (RLS) on `users` table
        - Added a policy to allow authenticated users to read their own row

      2. Policy Details
        - Policy Name: "Users can read their own data"
        - Applies to: SELECT
        - Condition: auth.uid() = id
    */

    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can read their own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
