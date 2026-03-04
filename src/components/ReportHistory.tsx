import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';
import type { SeoReport } from './SeoResults';

const getScoreBadge = (score: number) => {
  if (score >= 80) return 'bg-score-excellent/10 text-score-excellent border-score-excellent/30';
  if (score >= 60) return 'bg-score-good/10 text-score-good border-score-good/30';
  if (score >= 40) return 'bg-score-average/10 text-score-average border-score-average/30';
  return 'bg-score-poor/10 text-score-poor border-score-poor/30';
};

export const ReportHistory = ({
  reports,
  onSelect,
}: {
  reports: SeoReport[];
  onSelect: (report: SeoReport) => void;
}) => {
  if (reports.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-sm">No reports yet. Analyze a website to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect(report)}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-secondary transition-colors" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{report.url}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(report.created_at).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`shrink-0 ${getScoreBadge(report.seo_score)}`}>
              {report.seo_score}
            </Badge>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};
