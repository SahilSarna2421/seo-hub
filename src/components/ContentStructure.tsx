import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Hash } from "lucide-react";

interface ContentStructureProps {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasHeadings: boolean;
}

export const ContentStructure = ({ h1Count, h2Count, h3Count, hasHeadings }: ContentStructureProps) => {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
            <Hash className="h-5 w-5" />
          </div>
          Content Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {/* H1 Count */}
          <div className="text-center p-4 rounded-lg bg-muted/30 border">
            <p className="text-3xl font-bold text-orange-500">{h1Count}</p>
            <p className="text-sm text-muted-foreground">H1 Headings</p>
          </div>

          {/* H2 Count */}
          <div className="text-center p-4 rounded-lg bg-muted/30 border">
            <p className="text-3xl font-bold text-orange-500">{h2Count}</p>
            <p className="text-sm text-muted-foreground">H2 Headings</p>
          </div>

          {/* H3 Count */}
          <div className="text-center p-4 rounded-lg bg-muted/30 border">
            <p className="text-3xl font-bold text-orange-500">{h3Count}</p>
            <p className="text-sm text-muted-foreground">H3 Headings</p>
          </div>
        </div>

        {/* Warning if no headings */}
        {!hasHeadings && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-700">No headings detected</p>
              <p className="text-sm text-yellow-600">Add headings to improve structure</p>
            </div>
          </div>
        )}

        {/* Success message if headings are present */}
        {hasHeadings && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="p-1 rounded-full bg-green-500/20">
              <Hash className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-700">Good heading structure</p>
              <p className="text-sm text-green-600">Content is well-organized</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};