-- Add type field to goals table and update status enum
ALTER TABLE public.goals 
ADD COLUMN type TEXT CHECK (type IN ('outcome', 'process')) DEFAULT 'outcome';

-- Update status to match the new enum values  
ALTER TABLE public.goals 
DROP CONSTRAINT IF EXISTS goals_status_check;

ALTER TABLE public.goals 
ADD CONSTRAINT goals_status_check 
CHECK (status IN ('active', 'in_progress', 'on_hold', 'completed', 'archived'));

-- Create Activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  frequency TEXT,
  status TEXT CHECK (status IN ('active', 'completed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activities
CREATE POLICY "Users can view their own activities" 
ON public.activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create CheckIns table
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress_value TEXT NOT NULL,
  input_type TEXT CHECK (input_type IN ('numeric', 'checkbox', 'percentage')) DEFAULT 'checkbox',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for check_ins
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for check_ins
CREATE POLICY "Users can view their own check-ins" 
ON public.check_ins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
ON public.check_ins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
ON public.check_ins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" 
ON public.check_ins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
BEFORE UPDATE ON public.check_ins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint to prevent duplicate goal titles per user
ALTER TABLE public.goals 
ADD CONSTRAINT unique_goal_title_per_user 
UNIQUE (user_id, title);