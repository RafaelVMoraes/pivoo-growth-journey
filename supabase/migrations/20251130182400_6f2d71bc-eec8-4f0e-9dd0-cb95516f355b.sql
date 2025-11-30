-- Add priority field to goals table
ALTER TABLE public.goals 
ADD COLUMN priority text NOT NULL DEFAULT 'bronze' 
CHECK (priority IN ('gold', 'silver', 'bronze'));