-- Add reflection fields to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS surface_motivation TEXT,
ADD COLUMN IF NOT EXISTS deeper_motivation TEXT,
ADD COLUMN IF NOT EXISTS identity_motivation TEXT;