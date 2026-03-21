import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Loader2 } from 'lucide-react';

type Props = {
  onAnalyze: (url: string) => Promise<void>;
  loading: boolean;
};

export const AnalyzerForm = ({ onAnalyze, loading }: Props) => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onAnalyze(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl p-2 rounded-2xl bg-card border border-border/50 shadow-sm backdrop-blur-sm transition-all focus-within:border-primary/50 focus-within:shadow-glow">
      <div className="relative flex-1">
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="url"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-12 h-14 text-base bg-transparent border-none shadow-none focus-visible:ring-0 rounded-xl"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading} 
        className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow transition-all duration-300 font-medium text-base"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Website'
        )}
      </Button>
    </form>
  );
};
