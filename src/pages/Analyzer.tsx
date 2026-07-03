import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnalyzerForm } from "@/components/AnalyzerForm";
import { SeoResults, type SeoReport } from "@/components/SeoResults";
import { ReportHistory } from "@/components/ReportHistory";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

const Analyzer = () => {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-emerald-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] clip-path-polygon"></div>
      </div>

      <Navbar />

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-heading font-semibold">
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

export default Analyzer;