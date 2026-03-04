
-- Create seo_reports table
CREATE TABLE public.seo_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  seo_score INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  meta_description TEXT,
  h1_count INTEGER NOT NULL DEFAULT 0,
  images_without_alt INTEGER NOT NULL DEFAULT 0,
  total_images INTEGER NOT NULL DEFAULT 0,
  total_links INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_reports ENABLE ROW LEVEL SECURITY;

-- Users can only see their own reports
CREATE POLICY "Users can view their own reports" ON public.seo_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reports" ON public.seo_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.seo_reports FOR DELETE USING (auth.uid() = user_id);
