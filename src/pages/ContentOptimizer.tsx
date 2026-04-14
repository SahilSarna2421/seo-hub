import { useState } from "react";
import { motion } from "framer-motion";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Search, FileText, Loader2, Highlighter, AlertTriangle, XCircle } from "lucide-react";
import { KeywordPlacement } from "@/components/KeywordPlacement";
import { ContentStructure } from "@/components/ContentStructure";
import { SuggestedKeywords } from "@/components/SuggestedKeywords";
import { ReadabilityAnalysis } from "@/components/ReadabilityAnalysis";

const ContentOptimizer = () => {
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOptimize = async () => {
    if (!keyword || !content) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://seo-hub.onrender.com/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, content }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent 🚀";
    if (score >= 70) return "Good 👍";
    if (score >= 50) return "Average ⚠️";
    return "Needs Work ❌";
  };

  const getHighlightedText = () => {
    if (!keyword || !content) return content;
    const regex = new RegExp(`(${keyword})`, "gi");
    return content.replace(
      regex,
      `<mark class="bg-green-500/30 px-1 rounded">$1</mark>`
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
        <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-bl from-primary to-emerald-900 opacity-20 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem] clip-path-polygon"></div>
      </div>

      <Navbar />

      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 mb-8"
          >
            <h1 className="text-4xl font-heading font-bold">
              Content Optimizer
            </h1>
            <p className="text-lg text-muted-foreground">
              Write perfectly optimized articles to rank higher
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/30 pb-4">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  Enter Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter target keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-12 h-14 rounded-xl border-transparent bg-background/50 shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>

                <div className="relative group">
                  <textarea
                    placeholder="Paste your article here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full p-4 rounded-xl border-transparent bg-background/50 shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity">
                    <span>{content.length} chars</span>
                    <span className="w-1 h-1 rounded-full bg-border/80" />
                    <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                  </div>
                </div>

                <button
                  onClick={handleOptimize}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow transition-all duration-300 font-semibold text-base flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Optimize Content"}
                </button>

              </CardContent>
            </Card>
          </motion.div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >

              <Card className="rounded-2xl border-border/50 shadow-sm border-t border-t-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                  <div>
                    <CardTitle className="font-heading text-2xl font-bold mb-2">Optimization Score</CardTitle>
                    <Badge variant="outline" className={`font-medium py-1 px-3 ${
                      result.score >= 85 ? "bg-score-excellent/10 text-score-excellent border-score-excellent/20" : 
                      result.score >= 70 ? "bg-score-good/10 text-score-good border-score-good/20" : 
                      result.score >= 50 ? "bg-score-average/10 text-score-average border-score-average/20" : 
                      "bg-score-poor/10 text-score-poor border-score-poor/20"
                    }`}>
                      {getScoreLabel(result.score)}
                    </Badge>
                  </div>
                  <ScoreGauge score={result.score} />
                </CardHeader>

                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card/40 rounded-b-2xl border-t border-border/30">

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Words</p>
                    <p className="text-2xl font-bold">{result.total_words}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Keyword Count</p>
                    <p className="text-2xl font-bold text-primary">{result.keyword_count}</p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <div className="flex justify-between items-center text-sm">
                      <p className="font-medium text-muted-foreground">Keyword Density</p>
                      <p className="font-semibold">{result.keyword_density}%</p>
                    </div>

                    <div className="w-full bg-muted/80 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(parseFloat(result.keyword_density) * 20, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          result.keyword_density_status === "optimal"
                            ? "bg-green-500"
                            : result.keyword_density_status === "low"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs font-medium ${
                        result.keyword_density_status === "optimal"
                          ? "text-green-600"
                          : result.keyword_density_status === "low"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}>
                        {result.keyword_density_message}
                      </p>
                      <p className="text-xs text-muted-foreground">Optimal: 1% - 2.5%</p>
                    </div>
                  </div>

                </CardContent>
              </Card>

              <KeywordPlacement
                inStart={result.keyword_placement.inStart}
                inEnd={result.keyword_placement.inEnd}
              />

              <ContentStructure
                h1Count={result.content_structure.h1Count}
                h2Count={result.content_structure.h2Count}
                h3Count={result.content_structure.h3Count}
                hasHeadings={result.content_structure.hasHeadings}
              />

              <ReadabilityAnalysis readability={result.readability} />

              <SuggestedKeywords
                keywords={result.keyword_suggestions}
                mainKeyword={result.keyword}
              />

              {result.suggestions.length > 0 && (
                <Card className="rounded-2xl border-border/50 shadow-sm border-t border-t-yellow-500/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-xl flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      How to improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.suggestions.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors">
                        <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 shrink-0 mt-0.5">
                          <XCircle className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium leading-relaxed flex-1">{s}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentOptimizer;