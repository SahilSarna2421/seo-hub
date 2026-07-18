import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Lightbulb,
  Link2,
  Loader2,
  MessageCircleQuestion,
  PenTool,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

interface ContentBriefOverview {
  searchIntent: string;
  targetAudience: string;
  contentGoal: string;
  wordCount: string;
}

interface ContentBriefSeo {
  title: string;
  metaDescription: string;
  urlSlug: string;
}

interface ContentBriefHeadings {
  h1: string;
  h2: string[];
  h3: string[];
}

interface ContentBriefKeywords {
  related: string[];
  longTail: string[];
}

interface ContentBriefResponse {
  overview: ContentBriefOverview;
  seo: ContentBriefSeo;
  headings: ContentBriefHeadings;
  keywords: ContentBriefKeywords;
  faqs: string[];
  internalLinks: string[];
  writingTips: string[];
  callToAction: string;
}

const overviewMetrics = [
  {
    key: "searchIntent",
    title: "Search Intent",
    description: "The user intent behind the query.",
    icon: Search,
  },
  {
    key: "targetAudience",
    title: "Target Audience",
    description: "Who the content should speak to.",
    icon: Target,
  },
  {
    key: "contentGoal",
    title: "Content Goal",
    description: "The purpose of the content piece.",
    icon: FileText,
  },
  
];

const AIContentBrief = () => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ContentBriefResponse | null>(null);

  const handleGenerateBrief = async () => {
    if (!keyword.trim()) {
      setError("Please enter a target keyword to generate a content brief.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post<ContentBriefResponse>(
        `${import.meta.env.VITE_API_URL}/content-brief`,
        {
          keyword: keyword.trim(),
        }
      );
      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Could not generate the content brief."
      );
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
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            AI SEO Content Brief
          </h1>
          <p className="max-w-3xl mx-auto text-sm text-muted-foreground md:text-base">
            Generate a complete AI-powered SEO content brief for your target keyword with structure, intent, SEO metadata, FAQs and writing guidance.
          </p>
        </motion.div>

        <Card className="rounded-2xl border-border/50 shadow-sm bg-card/95">
          <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
            <CardTitle className="text-xl font-heading">Generate content brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_auto] items-end">
              <div className="grid gap-2">
                <Label htmlFor="brief-keyword">Enter target keyword</Label>
                <Input
                  id="brief-keyword"
                  type="text"
                  placeholder="e.g. local SEO services"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      handleGenerateBrief();
                    }
                  }}
                  className="bg-background/70"
                />
              </div>

              <Button
                type="button"
                onClick={handleGenerateBrief}
                disabled={loading}
                className="h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content Brief"
                )}
              </Button>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                <p className="font-medium">
                    {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {!result && !loading && (
          <Card className="rounded-3xl border-dashed border-border/50 p-10 text-center bg-card/60">
            <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Create your AI content brief</h3>
            <p className="mt-2 text-muted-foreground">
              Enter a keyword to unlock SEO guidance, audience insights, structure ideas and writing recommendations in one place.
            </p>
          </Card>
        )}

        {result && (
          <div className="space-y-8">
            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/60 p-5">
              <div>
                <p className="text-sm text-muted-foreground">Target Keyword</p>
                <h2 className="text-3xl font-bold mt-1">
                  {keyword}
                </h2>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                Powered by Google Gemini 2.5 Flash
              </div>
            </div>

            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" /> Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-4">
                  {overviewMetrics.map((metric) => {
                    const Icon = metric.icon;
                    const value = result.overview[metric.key as keyof ContentBriefOverview];
                    return (
                      <div key={metric.key} className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{metric.title}</p>
                            <p className="text-sm text-muted-foreground">{metric.description}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-foreground">{value}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-primary" /> SEO Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-4">
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">SEO Title</p>
                    <p className="mt-2 text-sm text-foreground">{result.seo.title}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Meta Description</p>
                    <p className="mt-2 text-sm text-foreground">{result.seo.metaDescription}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">URL Slug</p>
                    <p className="mt-2 text-sm text-foreground">{result.seo.urlSlug}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                        Recommended Word Count
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                        {result.overview.wordCount} 
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Suggested Headings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">H1</p>
                    <p className="mt-2 text-sm text-foreground">{result.headings.h1}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">H2</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.headings.h2.length > 0 ? (
                        result.headings.h2.map((heading, index) => (
                          <Badge key={index} variant="outline" className="rounded-full px-3 py-2 text-sm">
                            {heading}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No H2 suggestions found.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">H3</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.headings.h3.length > 0 ? (
                        result.headings.h3.map((heading, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full px-3 py-2 text-sm">
                            {heading}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No H3 suggestions found.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Related Keywords</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.keywords.related.length > 0 ? (
                        result.keywords.related.map((item, index) => (
                          <Badge key={index} variant="outline" className="rounded-full px-3 py-2 text-sm">
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No related keywords found.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Long-tail Keywords</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.keywords.longTail.length > 0 ? (
                        result.keywords.longTail.map((item, index) => (
                          <Badge key={index} variant="secondary" className="rounded-full px-3 py-2 text-sm">
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No long-tail keywords found.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircleQuestion className="h-5 w-5 text-primary" /> FAQs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.faqs.length > 0 ? (
                    result.faqs.map((faq, index) => (
                      <div key={index} className="rounded-3xl border border-border/50 bg-muted/20 p-4 text-sm text-foreground">
                        {faq}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No FAQ suggestions generated.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" /> Internal Linking Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.internalLinks.length > 0 ? (
                    result.internalLinks.map((link, index) => (
                      <div key={index} className="rounded-3xl border border-border/50 bg-muted/20 p-4 text-sm text-foreground">
                        {link}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No internal linking suggestions available.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" /> Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-3">
                  {result.writingTips.length > 0 ? (
                    result.writingTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 rounded-3xl border border-border/50 bg-muted/20 p-4">
                        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <p className="text-sm text-foreground">{tip}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No writing tips available.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="rounded-3xl border-border/50 bg-card/80 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> Call to Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-5 text-sm text-foreground">
                    {result.callToAction}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIContentBrief;
