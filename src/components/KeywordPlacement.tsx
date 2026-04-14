import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, MapPin } from "lucide-react";

interface KeywordPlacementProps {
  inStart: boolean;
  inEnd: boolean;
}

export const KeywordPlacement = ({ inStart, inEnd }: KeywordPlacementProps) => {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <MapPin className="h-5 w-5" />
          </div>
          Keyword Placement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First 100 words */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-3">
              {inStart ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">Introduction</p>
                <p className="text-sm text-muted-foreground">First 100 words</p>
              </div>
            </div>
            <Badge variant="outline" className={
              inStart
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
            }>
              {inStart ? "Present" : "Missing"}
            </Badge>
          </div>

          {/* Last 100 words */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-3">
              {inEnd ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">Conclusion</p>
                <p className="text-sm text-muted-foreground">Last 100 words</p>
              </div>
            </div>
            <Badge variant="outline" className={
              inEnd
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
            }>
              {inEnd ? "Present" : "Missing"}
            </Badge>
          </div>
        </div>

        {/* Suggestions */}
        {(!inStart || !inEnd) && (
          <div className="pt-2 space-y-2">
            {!inStart && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Add keyword in introduction</span>
              </div>
            )}
            {!inEnd && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Include keyword near conclusion</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};