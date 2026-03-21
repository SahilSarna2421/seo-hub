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
  if (score >= 80) return 'hsl(142, 71%, 45%)';
  if (score >= 60) return 'hsl(84, 81%, 60%)';
  if (score >= 40) return 'hsl(43, 96%, 56%)';
  return 'hsl(0, 84%, 60%)';
};

export const ScoreGauge = ({ score }: { score: number }) => {
  // Increased radius for a larger premium gauge
  const radius = 64; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative w-48 h-48 drop-shadow-lg">
        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
          <motion.circle
            cx="80" cy="80" r={radius} fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            className={score >= 80 ? "drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]" : ""}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-5xl font-heading font-bold ${getScoreColor(score)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-1 font-medium">/ 100</span>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1 }}
        className={`mt-4 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-semibold tracking-wide ${getScoreColor(score)}`}
      >
        {getScoreLabel(score)}
      </motion.div>
    </motion.div>
  );
};
