import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AnalyzerForm } from '@/components/AnalyzerForm';
import { SeoResults, type SeoReport } from '@/components/SeoResults';
import { ReportHistory } from '@/components/ReportHistory';
import { Button } from '@/components/ui/button';
import { Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentReport, setCurrentReport] = useState<SeoReport | null>(null);
  const [reports, setReports] = useState<SeoReport[]>([]);

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const fetchReports = async () => {
    const { data } = await supabase
      .from('seo_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setReports(data.map(r => ({
        ...r,
        suggestions: Array.isArray(r.suggestions) ? r.suggestions as string[] : [],
      })));
    }
  };

  const handleAnalyze = async (url: string) => {
    setAnalyzing(true);
    setCurrentReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-seo', {
        body: { url },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Analysis failed');

      const report = data.report;

      // Save to DB
      const { error: insertError } = await supabase.from('seo_reports').insert({
        user_id: user!.id,
        url: report.url,
        seo_score: report.seo_score,
        title: report.title,
        meta_description: report.meta_description,
        h1_count: report.h1_count,
        images_without_alt: report.images_without_alt,
        total_images: report.total_images,
        total_links: report.total_links,
        word_count: report.word_count,
        suggestions: report.suggestions,
      });

      if (insertError) throw insertError;

      setCurrentReport(report);
      fetchReports();
    } catch (err: any) {
      toast({ title: 'Analysis failed', description: err.message, variant: 'destructive' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-secondary" />
            <h1 className="text-xl font-heading font-bold text-foreground">SEO Toolkit</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-heading font-semibold text-foreground">Analyze any website</h2>
          <AnalyzerForm onAnalyze={handleAnalyze} loading={analyzing} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex justify-center">
            {currentReport ? (
              <SeoResults report={currentReport} />
            ) : (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Enter a URL above to get your SEO analysis
              </div>
            )}
          </div>
          <div>
            <ReportHistory reports={reports} onSelect={setCurrentReport} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
