import { motion } from 'framer-motion';

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-score-excellent';
  if (score >= 60) return 'text-score-good';
  if (score >= 40) return 'text-score-average';
  return 'text-score-poor';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
};

const getStrokeColor = (score: number) => {
  if (score >= 80) return 'hsl(150, 60%, 42%)';
  if (score >= 60) return 'hsl(80, 60%, 45%)';
  if (score >= 40) return 'hsl(40, 90%, 55%)';
  return 'hsl(0, 72%, 51%)';
};

export const ScoreGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-3xl font-heading font-bold ${getScoreColor(score)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-medium ${getScoreColor(score)}`}>{getScoreLabel(score)}</span>
    </div>
  );
};
