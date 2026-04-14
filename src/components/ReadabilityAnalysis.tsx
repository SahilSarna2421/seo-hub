import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface ReadabilityAnalysisProps {
  readability: {
    score: number;
    total_sentences: number;
    total_words: number;
    average_words_per_sentence: number;
    label: string;
  };
}

export const ReadabilityAnalysis = ({ readability }: ReadabilityAnalysisProps) => {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
            <FileText className="h-5 w-5" />
          </div>
          Readability Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-purple-500">{readability.score}/100</p>
            <p className="text-sm text-muted-foreground">Readability Score</p>
          </div>
          <Badge variant="outline" className={`font-medium py-2 px-4 ${
            readability.label === "Easy" ? "bg-green-500/10 text-green-600 border-green-500/20" :
            readability.label === "Medium" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
            "bg-red-500/10 text-red-600 border-red-500/20"
          }`}>
            {readability.label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{readability.total_sentences}</p>
            <p className="text-xs text-muted-foreground">Sentences</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{readability.total_words}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{readability.average_words_per_sentence}</p>
            <p className="text-xs text-muted-foreground">Avg Words/Sentence</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};