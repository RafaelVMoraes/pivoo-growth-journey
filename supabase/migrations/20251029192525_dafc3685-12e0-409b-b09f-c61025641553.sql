-- Add new columns to activities table for detailed frequency tracking
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS time_of_day TEXT,
ADD COLUMN IF NOT EXISTS days_of_week TEXT[],
ADD COLUMN IF NOT EXISTS day_of_month INTEGER;

-- Add comments for clarity
COMMENT ON COLUMN activities.time_of_day IS 'For daily activities: morning, afternoon, or night';
COMMENT ON COLUMN activities.days_of_week IS 'For weekly activities: array of days (monday, tuesday, etc.)';
COMMENT ON COLUMN activities.day_of_month IS 'For monthly activities: day number (1-31)';