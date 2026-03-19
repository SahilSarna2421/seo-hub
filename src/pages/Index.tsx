import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnalyzerForm } from "@/components/AnalyzerForm";
import { SeoResults, type SeoReport } from "@/components/SeoResults";
import { ReportHistory } from "@/components/ReportHistory";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentReport, setCurrentReport] = useState<SeoReport | null>(null);
  const [reports, setReports] = useState<SeoReport[]>([]);

  const handleAnalyze = async (url: string) => {
    setAnalyzing(true);
    setCurrentReport(null);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Server failed to analyze the website");
      }

      const report = await response.json();

      setCurrentReport(report);
      setReports((prev) => [report, ...prev]);

    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message,
        variant: "destructive",
      });
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
            <h1 className="text-xl font-heading font-bold text-foreground">
              SEO Toolkit
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            Analyze any website
          </h2>

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
            <ReportHistory
              reports={reports}
              onSelect={setCurrentReport}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;