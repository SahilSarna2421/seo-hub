import { ScoreGauge } from './ScoreGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  FileText, Type, Hash, Image, Link, AlignLeft,
  CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';

export type SeoReport = {
  id: string;
  url: string;
  seo_score: number;
  title: string | null;
  meta_description: string | null;
  h1_count: number;
  images_without_alt: number;
  total_images: number;
  total_links: number;
  word_count: number;
  suggestions: string[];
  created_at: string;
};

const MetricCard = ({ icon: Icon, label, value, status }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'bad';
}) => {
  const statusColors = {
    good: 'text-score-excellent',
    warning: 'text-score-average',
    bad: 'text-score-poor',
  };
  const StatusIcon = status === 'good' ? CheckCircle2 : status === 'warning' ? AlertTriangle : XCircle;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
      </div>
      <StatusIcon className={`h-4 w-4 shrink-0 ${statusColors[status]}`} />
    </div>
  );
};

export const SeoResults = ({ report }: { report: SeoReport }) => {
  const suggestions = Array.isArray(report.suggestions) ? report.suggestions : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="font-heading text-xl">SEO Analysis</CardTitle>
            <p className="text-sm text-muted-foreground truncate max-w-md">{report.url}</p>
          </div>
          <ScoreGauge score={report.seo_score} />
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricCard
            icon={FileText}
            label="Title Tag"
            value={report.title || 'Missing'}
            status={report.title ? 'good' : 'bad'}
          />
          <MetricCard
            icon={Type}
            label="Meta Description"
            value={report.meta_description ? `${report.meta_description.substring(0, 60)}...` : 'Missing'}
            status={report.meta_description ? 'good' : 'bad'}
          />
          <MetricCard
            icon={Hash}
            label="H1 Tags"
            value={report.h1_count}
            status={report.h1_count === 1 ? 'good' : report.h1_count === 0 ? 'bad' : 'warning'}
          />
          <MetricCard
            icon={Image}
            label="Images without Alt"
            value={`${report.images_without_alt} / ${report.total_images}`}
            status={report.images_without_alt === 0 ? 'good' : report.images_without_alt <= 2 ? 'warning' : 'bad'}
          />
          <MetricCard
            icon={Link}
            label="Total Links"
            value={report.total_links}
            status={report.total_links > 0 ? 'good' : 'warning'}
          />
          <MetricCard
            icon={AlignLeft}
            label="Word Count"
            value={report.word_count}
            status={report.word_count >= 300 ? 'good' : report.word_count >= 100 ? 'warning' : 'bad'}
          />
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Badge variant="outline" className="shrink-0 mt-0.5 text-xs border-score-average text-score-average">
                  Fix
                </Badge>
                <span className="text-muted-foreground">{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
