-- Add is_focus_area column to life_wheel table
ALTER TABLE life_wheel 
ADD COLUMN is_focus_area boolean DEFAULT false;