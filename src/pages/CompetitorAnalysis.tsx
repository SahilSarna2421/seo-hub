import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

const CompetitorAnalysis = () => {
  const { toast } = useToast();

  const [yourUrl, setYourUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  const handleCompare = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!yourUrl.trim() || !competitorUrl.trim()) {
        toast({
        title: "Please complete both fields.",
        description: "Enter your website URL and a competitor URL before comparing.",
        variant: "destructive",
        });
        return;
    }

    setLoading(true);
    setComparisonData(null);

    try {
        const response = await fetch("http://localhost:5000/compare", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url1: yourUrl,
            url2: competitorUrl,
        }),
        });

        if (!response.ok) {
        throw new Error("Failed to compare websites");
        }

        const data = await response.json();

        setComparisonData(data);

    } catch (err: any) {
        toast({
        title: "Comparison failed",
        description: err.message,
        variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-emerald-800 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] clip-path-polygon"></div>
      </div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <h2 className="text-2xl font-heading font-semibold">Competitor Analysis</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Compare the SEO performance of your website with a competitor to identify improvement opportunities and benchmark your ranking factors.
          </p>
        </motion.div>

        <div className="grid gap-8">
          <Card className="border border-border/50 shadow-sm bg-card/95">
            <CardHeader>
              <CardTitle className="text-xl">Compare URLs</CardTitle>
              <CardDescription>
                Enter your website and a competitor website below to start a side-by-side SEO comparison.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleCompare} className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="your-website">Your Website URL</Label>
                  <Input
                    id="your-website"
                    type="url"
                    placeholder="https://your-site.com"
                    value={yourUrl}
                    onChange={(event) => setYourUrl(event.target.value)}
                    className="bg-transparent"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="competitor-website">Competitor Website URL</Label>
                  <Input
                    id="competitor-website"
                    type="url"
                    placeholder="https://competitor.com"
                    value={competitorUrl}
                    onChange={(event) => setCompetitorUrl(event.target.value)}
                    className="bg-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow transition-all duration-300 font-medium text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    "Compare Websites"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {comparisonData && (() => {
            const site1 = comparisonData.site1 ?? {};
            const site2 = comparisonData.site2 ?? {};
            const site1Score = Number(site1.seo_score ?? 0);
            const site2Score = Number(site2.seo_score ?? 0);
            const winnerText =
                site1Score === site2Score
                    ? "🤝 Tie"
                    : site1Score > site2Score
                    ? "🏆 Your Website"
                    : "🏆 Competitor";
            const scoreDiff =
                site1Score === site2Score
                    ? "0 Points"
                    : `+${Math.abs(site1Score - site2Score)} Points`;
            const valueLabel = (value: unknown) => {
              if (value === null || value === undefined || value === "") return "-";
              if (typeof value === "boolean") return value ? "Present" : "Missing";
              return String(value);
            };

            const isPresent = (value: unknown) => {
              if (value === true) return true;
              if (typeof value === "string") {
                const normalized = value.toLowerCase().trim();
                return normalized === "present" || normalized === "yes" || normalized === "true";
              }
              return Boolean(value);
            };

            const clampNumber = (value: unknown) => {
              const number = Number(value);
              return Number.isFinite(number) ? number : 0;
            };

            const betterLabel = (label: string, isTie = false) => (
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isTie ? "bg-muted text-muted-foreground" : "bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {label}
              </span>
            );

            const getBetterWebsite = (metric: string, a: unknown, b: unknown) => {
              const aNum = clampNumber(a);
              const bNum = clampNumber(b);

              switch (metric) {
                case "SEO Score":
                  return aNum === bNum ? "Tie" : aNum > bNum ? "Your Website" : "Competitor";
                case "Title":
                case "Meta Description":
                case "Viewport": {
                  const aPresent = isPresent(a);
                  const bPresent = isPresent(b);
                  if (aPresent === bPresent) return "Tie";
                  return aPresent ? "Your Website" : "Competitor";
                }
                case "H1 Count":
                  return getClosenessWinner(aNum, bNum, 1);
                case "H2 Count":
                  return getClosenessWinner(aNum, bNum, 3);
                case "H3 Count":
                  return getClosenessWinner(aNum, bNum, 4);
                case "Word Count":
                  return getClosenessWinner(aNum, bNum, 800, true);
                case "Images":
                  return aNum === bNum ? "Tie" : aNum > bNum ? "Your Website" : "Competitor";
                case "Images without Alt":
                  return aNum === bNum ? "Tie" : aNum < bNum ? "Your Website" : "Competitor";
                case "Internal Links":
                  return aNum === bNum ? "Tie" : aNum > bNum ? "Your Website" : "Competitor";
                case "External Links":
                  return aNum === bNum ? "Tie" : aNum < bNum ? "Your Website" : "Competitor";
                case "Broken Links":
                  return aNum === bNum ? "Tie" : aNum < bNum ? "Your Website" : "Competitor";
                case "Page Size":
                  return getClosenessWinner(parseSize(a), parseSize(b), 500);
                case "Load Time":
                  return getClosenessWinner(parseTime(a), parseTime(b), 2000);
                default:
                  return "Tie";
              }
            };

            const getClosenessWinner = (a: number, b: number, ideal: number, higherBetter = false) => {
              const aDistance = Math.abs(a - ideal);
              const bDistance = Math.abs(b - ideal);
              if (aDistance === bDistance) {
                if (higherBetter && a !== b) return a > b ? "Your Website" : "Competitor";
                return "Tie";
              }
              return aDistance < bDistance ? "Your Website" : "Competitor";
            };

            const parseSize = (value: unknown) => {
              if (typeof value === "number") return value;
              if (typeof value === "string") {
                const cleaned = value.toLowerCase().replace("mb", "").replace("kb", "");
                return Number(cleaned) || 0;
              }
              return 0;
            };

            const parseTime = (value: unknown) => {
              if (typeof value === "number") return value;
              if (typeof value === "string") {
                return Number(value.replace(/[^0-9.]/g, "")) || 0;
              }
              return 0;
            };

            const insights: string[] = [];
            if (winnerText !== "🤝 Tie") {
              insights.push(`${winnerText === "🏆 Your Website" ? "Your website" : "The competitor"} has the stronger overall SEO score.`);
            } else {
              insights.push("Both sites have an even overall SEO score.");
            }
            if (clampNumber(site1.broken_links) < clampNumber(site2.broken_links)) {
              insights.push("Your website has fewer broken links.");
            } else if (clampNumber(site2.broken_links) < clampNumber(site1.broken_links)) {
              insights.push("Competitor has fewer broken links.");
            }
            if (parseTime(site1.load_time_ms) < parseTime(site2.load_time_ms)) {
              insights.push("Your site loads faster than the competitor.");
            } else if (parseTime(site2.load_time_ms) < parseTime(site1.load_time_ms)) {
              insights.push("Competitor has a faster loading speed.");
            }
            if (site1.h1_count === 1 && site2.h1_count !== 1) {
              insights.push("Your H1 structure is closer to SEO best practices.");
            } else if (site2.h1_count === 1 && site1.h1_count !== 1) {
              insights.push("Competitor follows H1 best practices more closely.");
            }
            if (clampNumber(site1.images_without_alt) < clampNumber(site2.images_without_alt)) {
              insights.push("Your website has fewer images missing alt text.");
            } else if (clampNumber(site2.images_without_alt) < clampNumber(site1.images_without_alt)) {
              insights.push("Competitor has better image alt coverage.");
            }
            if (insights.length < 5) {
              insights.push("Both websites can improve technical SEO with stronger content and page performance optimizations.");
            }

            const renderSuggestions = (suggestions: any) => {
              if (Array.isArray(suggestions)) {
                return (
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    {suggestions.map((item, index) => (
                      <li key={index}>{String(item)}</li>
                    ))}
                  </ul>
                );
              }
              return <p className="text-sm text-muted-foreground">{String(suggestions ?? "No recommendations available.")}</p>;
            };

            return (
              <Card className="border border-border/50 shadow-sm bg-card/95">
                <CardHeader>
                  <CardTitle>Comparison results</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-8">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-border/50 bg-muted/20 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Your SEO Score</p>
                      <p className="mt-3 text-3xl font-semibold">{site1Score} / 100</p>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-muted/20 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Competitor SEO Score</p>
                      <p className="mt-3 text-3xl font-semibold">{site2Score} / 100</p>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-muted/20 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Overall Winner</p>
                      <p className="mt-3 text-2xl font-semibold">{winnerText}</p>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-muted/20 p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Score Difference</p>
                      <p className="mt-3 text-3xl font-semibold">{scoreDiff}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/50 bg-card/80 shadow-sm overflow-hidden">
                    <div className="border-b border-border/50 bg-muted/20 p-5">
                      <h3 className="text-lg font-semibold">Technical SEO Comparison</h3>
                      <p className="mt-1 text-sm text-muted-foreground">A side-by-side comparison of technical on-page SEO and viewport readiness.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-muted/30 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3">Metric</th>
                            <th className="px-4 py-3">Your Website</th>
                            <th className="px-4 py-3">Competitor</th>
                            <th className="px-4 py-3">Ideal</th>
                            <th className="px-4 py-3">Better Website</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["SEO Score", site1Score, site2Score, "Higher is better"],
                            ["Title", valueLabel(site1.title), valueLabel(site2.title), "Present"],
                            ["Meta Description", valueLabel(site1.meta_description), valueLabel(site2.meta_description), "Present"],
                            ["H1 Count", valueLabel(site1.h1_count), valueLabel(site2.h1_count), "Exactly 1"],
                            ["H2 Count", valueLabel(site1.h2_count), valueLabel(site2.h2_count), "3-8 headings"],
                            ["H3 Count", valueLabel(site1.h3_count), valueLabel(site2.h3_count), "As Needed"],
                            ["Viewport", valueLabel(site1.has_viewport), valueLabel(site2.has_viewport), "Required"],
                          ].map(([label, value1, value2, ideal]) => {
                            const better = getBetterWebsite(String(label), value1, value2);
                            return (
                              <tr key={String(label)} className="border-b border-border/50 hover:bg-muted/40">
                                <td className="px-4 py-4 font-semibold text-foreground">{label}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(value1)}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(value2)}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(ideal)}</td>
                                <td className="px-4 py-4">{betterLabel(better, better === "Tie")}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/50 bg-card/80 shadow-sm overflow-hidden">
                    <div className="border-b border-border/50 bg-muted/20 p-5">
                      <h3 className="text-lg font-semibold">Content & Performance Comparison</h3>
                      <p className="mt-1 text-sm text-muted-foreground">A content and performance review for SEO health and user experience.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-muted/30 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3">Metric</th>
                            <th className="px-4 py-3">Your Website</th>
                            <th className="px-4 py-3">Competitor</th>
                            <th className="px-4 py-3">Ideal</th>
                            <th className="px-4 py-3">Better Website</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Word Count", valueLabel(site1.word_count), valueLabel(site2.word_count), "600+ words"],
                            ["Images", valueLabel(site1.total_images), valueLabel(site2.total_images), "Relevant images with alt text"],
                            ["Images without Alt", valueLabel(site1.images_without_alt), valueLabel(site2.images_without_alt), "0"],
                            ["Internal Links", valueLabel(site1.internal_links), valueLabel(site2.internal_links), "3+"],
                            ["External Links", valueLabel(site1.external_links), valueLabel(site2.external_links), "Balanced"],
                            ["Broken Links", valueLabel(site1.broken_links), valueLabel(site2.broken_links), "0"],
                            ["Page Size", valueLabel(site1.page_size_kb), valueLabel(site2.page_size_kb), "< 500 KB"],
                            ["Load Time", valueLabel(site1.load_time_ms), valueLabel(site2.load_time_ms), "< 2000 ms"],
                          ].map(([label, value1, value2, ideal]) => {
                            const better = getBetterWebsite(String(label), value1, value2);
                            return (
                              <tr key={String(label)} className="border-b border-border/50 hover:bg-muted/40">
                                <td className="px-4 py-4 font-semibold text-foreground">{label}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(value1)}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(value2)}</td>
                                <td className="px-4 py-4 text-muted-foreground">{String(ideal)}</td>
                                <td className="px-4 py-4">{betterLabel(better, better === "Tie")}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/50 bg-muted/20 p-6">
                    <h3 className="text-lg font-semibold">Key Insights</h3>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground list-disc pl-5">
                      {insights.slice(0, 6).map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-border/50 bg-card/80 p-6">
                      <h3 className="text-base font-semibold">Recommendations for Your Website</h3>
                      <div className="mt-4">{renderSuggestions(site1.suggestions)}</div>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-card/80 p-6">
                      <h3 className="text-base font-semibold">Recommendations for Competitor</h3>
                      <div className="mt-4">{renderSuggestions(site2.suggestions)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

export default CompetitorAnalysis;
