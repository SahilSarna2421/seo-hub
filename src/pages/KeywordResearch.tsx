import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, DollarSign, Gauge, Loader2, Search, Target, TrendingUp } from "lucide-react";

interface KeywordResearchOverview {
  searchVolume: string;
  difficulty: string;
  competition: string;
  cpc: string;
  intent: string;
}

interface KeywordResearchResponse {
  overview: KeywordResearchOverview;
  relatedKeywords: string[];
  longTailKeywords: string[];
  questionKeywords: string[];
  recommendations: string[];
}

const overviewMetrics = [
  {
    key: "searchVolume",
    title: "Estimated Search Volume",
    description: "Monthly search demand.",
    icon: Search,
  },
  {
    key: "difficulty",
    title: "Estimated Keyword Difficulty",
    description: "How hard it is to rank.",
    icon: Gauge,
  },
  {
    key: "competition",
    title: "Estimated Competition",
    description: "How many advertisers compete.",
    icon: TrendingUp,
  },
  {
    key: "cpc",
    title: "Estimated CPC",
    description: "Average ad cost per click.",
    icon: DollarSign,
  },
  {
    key: "intent",
    title: "Search Intent",
    description: "User goal behind the query.",
    icon: Target,
  },
];

const KeywordResearch = () => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KeywordResearchResponse | null>(null);

  const handleResearch = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword to research.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post<KeywordResearchResponse>("/keyword-research", {
        keyword: keyword.trim(),
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Could not fetch keyword research results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-primary to-emerald-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] clip-path-polygon"></div>
      </div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Keyword Research Tool</h1>
          <p className="max-w-3xl mx-auto text-sm text-muted-foreground md:text-base">
            Discover keyword ideas, long-tail opportunities, search intent and SEO recommendations for your content.
          </p>
        </motion.div>

        <Card className="rounded-2xl border-border/50 shadow-sm bg-card/95">
          <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
            <CardTitle className="text-xl font-heading">Keyword research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_auto] items-end">
              <div className="grid gap-2">
                <Label htmlFor="keyword-input">Enter target keyword</Label>
                <Input
                    id="keyword-input"
                    type="text"
                    placeholder="e.g. sustainable SEO strategies"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !loading) {
                        handleResearch();
                        }
                    }}
                    className="bg-background/70"
                />                
              </div>

              <Button
                type="button"
                onClick={handleResearch}
                disabled={loading}
                className="h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  "Research Keywords"
                )}
              </Button>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                <div>
                <p className="font-medium">Unable to fetch keyword research.</p>
                <p className="text-xs mt-1 opacity-80">
                    Please try again in a few moments.
                </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!result && !loading && (
            <Card className="rounded-3xl border-dashed border-border/50 p-10 text-center bg-card/60">
                <Search className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">
                Start your keyword research
                </h3>
                <p className="mt-2 text-muted-foreground">
                Enter a keyword above to discover related keywords,
                long-tail opportunities, search intent and SEO recommendations.
                </p>
            </Card>
        )}

        {result && (
            <div className="space-y-8">

                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/60 p-5">
                <div>
                    <p className="text-sm text-muted-foreground">
                    Showing results for
                    </p>
                    <h2 className="text-3xl font-bold mt-1">
                    "{keyword}"
                    </h2>
                </div>
            </div>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {overviewMetrics.map((metric) => {
                const Icon = metric.icon;
                const value = result.overview[metric.key as keyof KeywordResearchOverview];
                return (
                  <Card key={metric.key} className="rounded-3xl border-border/50 bg-muted/20 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{metric.description}</p>
                  </Card>
                );
              })}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Keywords</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-3">
                    {result.relatedKeywords.length > 0 ? (
                      result.relatedKeywords.map((keywordItem, index) => (
                        <Badge key={index} variant="outline" className="rounded-full px-3 py-2 text-sm">
                          {keywordItem}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No related keywords found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Long-tail Keywords</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.longTailKeywords.length > 0 ? (
                    result.longTailKeywords.map((term, index) => (
                      <div key={index} className="rounded-3xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground">
                        {term}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No long-tail keywords available.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Question Keywords</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.questionKeywords.length > 0 ? (
                    result.questionKeywords.map((question, index) => (
                      <div key={index} className="rounded-3xl border border-border/50 bg-muted/20 p-4 text-sm text-foreground">
                        {question}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No question keywords returned.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">SEO Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.recommendations.length > 0 ? (
                    result.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 rounded-3xl border border-border/50 bg-muted/20 p-4">
                        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <p className="text-sm text-foreground">{recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No SEO recommendations available.</p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default KeywordResearch;
