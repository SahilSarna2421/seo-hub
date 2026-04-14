/**
 * Readability utility functions for content analysis
 */

/**
 * Splits text into sentences using common sentence endings
 */
export const splitIntoSentences = (text: string): string[] => {
  // Split on period, question mark, or exclamation mark followed by space or end of string
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  return sentences.map(sentence => sentence.trim());
};

/**
 * Splits text into words, filtering out empty strings
 */
export const splitIntoWords = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

/**
 * Calculates readability metrics from content
 */
export const calculateReadabilityMetrics = (content: string) => {
  const sentences = splitIntoSentences(content);
  const words = splitIntoWords(content);

  const totalSentences = sentences.length;
  const totalWords = words.length;
  const averageWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;

  return {
    totalSentences,
    totalWords,
    averageWordsPerSentence: Math.round(averageWordsPerSentence * 100) / 100, // Round to 2 decimal places
  };
};

/**
 * Calculates a simple readability score based on average words per sentence
 * Lower average words per sentence = higher readability score
 */
export const calculateReadabilityScore = (content: string): number => {
  const { averageWordsPerSentence } = calculateReadabilityMetrics(content);

  // Simple formula: score = 100 - (average words per sentence * 1.5)
  // This gives higher scores for shorter sentences (easier to read)
  let score = 100 - (averageWordsPerSentence * 1.5);

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
};

/**
 * Gets readability level label based on score
 */
export const getReadabilityLabel = (score: number): string => {
  if (score >= 70) return "Easy";
  if (score >= 40) return "Medium";
  return "Hard";
};