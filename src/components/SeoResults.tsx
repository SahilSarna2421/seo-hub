import { ScoreGauge } from './ScoreGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  FileText, Type, Hash, Image, Link, AlignLeft, Clock,
  CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';

export type SeoReport = {
  id: string;
  url: string;
  seo_score: number;
  title: string | null;
  meta_description: string | null;

  h1_count: number;
  h1_tags?: string[];

  h2_count?: number;
  h3_count?: number;

  heading_analysis?: {
    h1: number;
    h2: number;
    h3: number;
    issues: string[];
  };

  images_without_alt: number;
  total_images: number;

  total_links: number;
  internal_links?: number;
  external_links?: number;

  broken_links?: number;
  broken_links_list?: string[];

  word_count: number;

  load_time_ms?: number;

  keyword_density?: {
    keyword: string;
    count: number;
    density: string;
  }[];

  score_breakdown?: {
    meta_tags: { score: number; max: number };
    content: { score: number; max: number };
    performance: { score: number; max: number };
    links: { score: number; max: number };
  };

  seo_breakdown?: {
    factor: string;
    status: 'good' | 'warning' | 'bad';
    impact: string;
  }[];

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

  const StatusIcon =
    status === 'good' ? CheckCircle2 :
    status === 'warning' ? AlertTriangle :
    XCircle;

  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:shadow-glow hover:border-primary/50 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      <div className={`p-2.5 rounded-xl bg-muted/50 ${statusColors[status]}`}>
        <Icon className="h-5 w-5 shrink-0" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <p className="text-lg font-semibold text-foreground truncate">
          {value !== null && value !== undefined && value !== '' ? value : '—'}
        </p>
      </div>
      <StatusIcon className={`h-5 w-5 shrink-0 ${statusColors[status]}`} />
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
      {/* MAIN SEO CARD */}
      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden border-t border-t-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-8 pt-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">Analysis Complete</Badge>
            <CardTitle className="font-heading text-3xl font-bold mb-2">SEO Score</CardTitle>
            <p className="text-base text-muted-foreground truncate max-w-md">{report.url}</p>
          </div>
          <ScoreGauge score={report.seo_score} />
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

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
            value={
              report.h1_tags && report.h1_tags.length > 0
                ? report.h1_tags[0]
                : report.h1_count
            }
            status={report.h1_count === 1 ? 'good' : report.h1_count === 0 ? 'bad' : 'warning'}
          />

          <MetricCard
            icon={Image}
            label="Images without Alt"
            value={`${report.images_without_alt} / ${report.total_images}`}
            status={
              report.images_without_alt === 0
                ? 'good'
                : report.images_without_alt <= 2
                ? 'warning'
                : 'bad'
            }
          />

          <MetricCard
            icon={Link}
            label="Total Links"
            value={
              report.internal_links !== undefined
                ? `${report.total_links} (Int: ${report.internal_links}, Ext: ${report.external_links})`
                : report.total_links
            }
            status={report.total_links > 0 ? 'good' : 'warning'}
          />

          <MetricCard
            icon={AlignLeft}
            label="Word Count"
            value={report.word_count}
            status={
              report.word_count >= 300
                ? 'good'
                : report.word_count >= 100
                ? 'warning'
                : 'bad'
            }
          />

          {report.load_time_ms !== undefined && (
            <MetricCard
              icon={Clock}
              label="Load Time"
              value={`${report.load_time_ms} ms`}
              status={report.load_time_ms < 2000 ? 'good' : 'warning'}
            />
          )}

        </CardContent>
      </Card>

      {/* SCORE BREAKDOWN */}
      {report.score_breakdown && (
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold">Score Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed analysis by category</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-primary" />
                  <span className="font-medium">Meta Tags</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {report.score_breakdown.meta_tags.score}/{report.score_breakdown.meta_tags.max}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <AlignLeft className="h-5 w-5 text-primary" />
                  <span className="font-medium">Content</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {report.score_breakdown.content.score}/{report.score_breakdown.content.max}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Performance</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {report.score_breakdown.performance.score}/{report.score_breakdown.performance.max}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <Link className="h-5 w-5 text-primary" />
                  <span className="font-medium">Links</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {report.score_breakdown.links.score}/{report.score_breakdown.links.max}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO BREAKDOWN */}
      {report.seo_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">SEO Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.seo_breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span>{item.factor}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.impact}</Badge>
                  {item.status === 'good' && <CheckCircle2 className="text-score-excellent h-4 w-4" />}
                  {item.status === 'warning' && <AlertTriangle className="text-score-average h-4 w-4" />}
                  {item.status === 'bad' && <XCircle className="text-score-poor h-4 w-4" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* HEADING STRUCTURE */}
      {report.heading_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Heading Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>H1 Tags</span>
              <span>{report.heading_analysis.h1}</span>
            </div>

            <div className="flex justify-between">
              <span>H2 Tags</span>
              <span>{report.heading_analysis.h2}</span>
            </div>

            <div className="flex justify-between">
              <span>H3 Tags</span>
              <span>{report.heading_analysis.h3}</span>
            </div>

            {report.heading_analysis.issues.length > 0 && (
              <div className="pt-2 space-y-1">
                {report.heading_analysis.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-score-poor">
                    <XCircle className="h-4 w-4" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>
      )}

      {/* KEYWORD DENSITY */}
      {report.keyword_density && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Top Keywords</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.keyword_density.map((kw, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{kw.keyword}</span>
                <span>{kw.count} ({kw.density}%)</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* BROKEN LINKS */}
      {report.broken_links !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Broken Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Total Broken Links</span>
              <span className={report.broken_links > 0 ? "text-score-poor" : "text-score-excellent"}>
                {report.broken_links}
              </span>
            </div>

            {report.broken_links > 0 && report.broken_links_list && (
              <div className="pt-2 space-y-1">
                {report.broken_links_list.slice(0, 5).map((link, i) => (
                  <div key={i} className="text-xs text-muted-foreground truncate">
                    {link}
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>
      )}

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <Card className="rounded-2xl border-border/50 shadow-sm border-t border-t-yellow-500/20">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Actionable Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 shrink-0 mt-0.5">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{s}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 whitespace-nowrap bg-background">
                  Needs Fix
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};