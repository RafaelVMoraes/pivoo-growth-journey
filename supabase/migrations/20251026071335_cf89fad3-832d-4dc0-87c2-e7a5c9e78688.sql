-- Add support for multiple life areas per goal
ALTER TABLE goals 
  ALTER COLUMN life_wheel_area TYPE text[] USING ARRAY[life_wheel_area]::text[];

-- Add sub-goals support
ALTER TABLE goals 
  ADD COLUMN parent_goal_id uuid REFERENCES goals(id) ON DELETE CASCADE;

-- Add structured frequency to activities
ALTER TABLE activities 
  ADD COLUMN frequency_type text DEFAULT 'custom',
  ADD COLUMN frequency_value integer;

-- Create index for parent_goal_id for better query performance
CREATE INDEX idx_goals_parent_goal_id ON goals(parent_goal_id);

-- Add check constraint for frequency_type
ALTER TABLE activities 
  ADD CONSTRAINT activities_frequency_type_check 
  CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom'));