DROP POLICY IF EXISTS "Users can view their own reports" ON public.seo_reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.seo_reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.seo_reports;

CREATE POLICY "Users can view their own reports" ON public.seo_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reports" ON public.seo_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.seo_reports FOR DELETE TO authenticated USING (auth.uid() = user_id);