import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy } from "lucide-react";
import { useState } from "react";

interface SuggestedKeywordsProps {
  keywords: string[];
  mainKeyword: string;
}

export const SuggestedKeywords = ({ keywords, mainKeyword }: SuggestedKeywordsProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (keyword: string, index: number) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy keyword:', err);
    }
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Lightbulb className="h-5 w-5" />
          </div>
          Suggested Keywords
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Related keywords based on "{mainKeyword}"
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors group"
            >
              <Badge
                variant="secondary"
                className="font-medium text-sm px-3 py-1 bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                {keyword}
              </Badge>
              <button
                onClick={() => copyToClipboard(keyword, index)}
                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background transition-all"
                title="Copy keyword"
              >
                <Copy className={`h-4 w-4 ${
                  copiedIndex === index
                    ? 'text-green-500'
                    : 'text-muted-foreground hover:text-foreground'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {keywords.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No keyword suggestions available</p>
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            💡 Use these keywords naturally in your content to improve SEO without keyword stuffing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};