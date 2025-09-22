-- Create LifeWheel table for tracking life areas scores
CREATE TABLE public.life_wheel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  area_name TEXT NOT NULL,
  current_score INTEGER NOT NULL DEFAULT 1 CHECK (current_score >= 1 AND current_score <= 10),
  desired_score INTEGER NOT NULL DEFAULT 1 CHECK (desired_score >= 1 AND desired_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, area_name)
);

-- Enable Row Level Security
ALTER TABLE public.life_wheel ENABLE ROW LEVEL SECURITY;

-- Create policies for LifeWheel
CREATE POLICY "Users can view their own life wheel data" 
ON public.life_wheel 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own life wheel data" 
ON public.life_wheel 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own life wheel data" 
ON public.life_wheel 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create Values table for personal values selection
CREATE TABLE public.values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  value_name TEXT NOT NULL,
  selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, value_name)
);

-- Enable Row Level Security
ALTER TABLE public.values ENABLE ROW LEVEL SECURITY;

-- Create policies for Values
CREATE POLICY "Users can view their own values" 
ON public.values 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own values" 
ON public.values 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own values" 
ON public.values 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create Vision table for future planning
CREATE TABLE public.vision (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  year INTEGER NOT NULL,
  vision_1y TEXT,
  vision_3y TEXT,
  word_year TEXT,
  phrase_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year)
);

-- Enable Row Level Security
ALTER TABLE public.vision ENABLE ROW LEVEL SECURITY;

-- Create policies for Vision
CREATE POLICY "Users can view their own vision" 
ON public.vision 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vision" 
ON public.vision 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision" 
ON public.vision 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_life_wheel_updated_at
BEFORE UPDATE ON public.life_wheel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_values_updated_at
BEFORE UPDATE ON public.values
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vision_updated_at
BEFORE UPDATE ON public.vision
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();