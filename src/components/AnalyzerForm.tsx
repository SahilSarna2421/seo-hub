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
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-10"
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 min-w-[120px]">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
      </Button>
    </form>
  );
};
