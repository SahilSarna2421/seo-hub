import { useState } from "react";
import { motion } from "framer-motion";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useNavigate, useLocation } from "react-router-dom";

const ContentOptimizer = () => {
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOptimize = async () => {
    if (!keyword || !content) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/optimize", {
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
    <div className="min-h-screen bg-background">

      {/* 🔥 HEADER (NOW SAME AS ANALYZER) */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Search className="h-6 w-6 text-secondary" />
              <h1 className="text-xl font-heading font-bold">
                SEO Toolkit
              </h1>
            </div>

            {/* NAV */}
            <div className="flex gap-4 text-sm">

              <button
                onClick={() => navigate("/analyzer")}
                className={`px-3 py-1 rounded-md transition ${
                  location.pathname === "/analyzer"
                    ? "bg-secondary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Analyzer
              </button>

              <button
                onClick={() => navigate("/optimizer")}
                className={`px-3 py-1 rounded-md transition ${
                  location.pathname === "/optimizer"
                    ? "bg-secondary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Optimizer
              </button>

            </div>
          </div>

          {/* DARK MODE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border bg-muted hover:bg-accent transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>

        </div>
      </header>

      {/* MAIN */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-heading font-bold">
              SEO Content Optimizer
            </h1>
            <p className="text-muted-foreground">
              Improve your content using keyword-based SEO analysis
            </p>
          </div>

          {/* INPUT */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <input
                type="text"
                placeholder="Enter target keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-3 rounded-md border border-border bg-background"
              />

              <textarea
                placeholder="Paste your article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-3 rounded-md border border-border bg-background"
              />

              <p className="text-xs text-muted-foreground">
                {content.length} characters
              </p>

              <button
                onClick={handleOptimize}
                disabled={loading}
                className="w-full py-3 rounded-md bg-secondary text-white font-medium"
              >
                {loading ? "Analyzing..." : "Optimize Content"}
              </button>

            </CardContent>
          </Card>

          {/* RESULTS */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >

              {/* SCORE */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>SEO Score</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getScoreLabel(result.score)}
                    </p>
                  </div>
                  <ScoreGauge score={result.score} />
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <p className="text-muted-foreground">Total Words</p>
                    <p>{result.total_words}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Keyword Count</p>
                    <p>{result.keyword_count}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Keyword Density</p>
                    <p>{result.keyword_density}%</p>

                    <div className="w-full bg-muted h-2 rounded mt-1">
                      <div
                        className="bg-secondary h-2 rounded"
                        style={{
                          width: `${Math.min(parseFloat(result.keyword_density) * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Keyword in Start</p>
                    <p>{result.keyword_in_start ? "Yes" : "No"}</p>
                  </div>

                </CardContent>
              </Card>

              {/* HIGHLIGHT */}
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Highlight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                  />
                </CardContent>
              </Card>

              {/* SUGGESTIONS */}
              {result.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.suggestions.map((s: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <Badge variant="outline">Fix</Badge>
                        <span className="text-muted-foreground">{s}</span>
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