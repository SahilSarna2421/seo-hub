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

          {comparisonData && (
            <Card className="border border-border/50 shadow-sm bg-card/95">
              <CardHeader>
                <CardTitle>Comparison results</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <pre className="overflow-auto text-xs">
                    {JSON.stringify(comparisonData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompetitorAnalysis;
