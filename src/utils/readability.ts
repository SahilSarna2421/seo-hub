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

/**
 * Analyzes keyword placement in content
 */
export const analyzeKeywordPlacement = (content: string, keyword: string) => {
  const words = splitIntoWords(content.toLowerCase());
  const keywordLower = keyword.toLowerCase().trim();

  // Check first 100 words
  const first100Words = words.slice(0, 100).join(' ');
  const inStart = first100Words.includes(keywordLower);

  // Check last 100 words
  const last100Words = words.slice(-100).join(' ');
  const inEnd = last100Words.includes(keywordLower);

  return {
    inStart,
    inEnd,
  };
};

/**
 * Analyzes heading structure in content
 * Assumes plain text input with markdown-style headings
 */
export const analyzeHeadingStructure = (content: string) => {
  const lines = content.split('\n');

  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Count headings based on markdown syntax
    if (trimmedLine.startsWith('###')) {
      h3Count++;
    } else if (trimmedLine.startsWith('##')) {
      h2Count++;
    } else if (trimmedLine.startsWith('#')) {
      h1Count++;
    }
  });

  const totalHeadings = h1Count + h2Count + h3Count;
  const hasHeadings = totalHeadings > 0;

  return {
    h1Count,
    h2Count,
    h3Count,
    totalHeadings,
    hasHeadings,
  };
};

/**
 * Generates related keyword suggestions based on the main keyword
 */
export const generateKeywordSuggestions = (keyword: string): string[] => {
  const baseKeyword = keyword.toLowerCase().trim();
  const suggestions: string[] = [];

  // Add the original keyword variations
  suggestions.push(baseKeyword);

  // Add plural form (simple - just add 's' if not already plural)
  if (!baseKeyword.endsWith('s') && !baseKeyword.endsWith('es')) {
    suggestions.push(baseKeyword + 's');
  }

  // Common variations and modifiers
  const modifiers = [
    'guide',
    'tips',
    'best',
    'how to',
    'ultimate',
    'complete',
    'easy',
    'quick',
    'top',
    'free'
  ];

  // Add combinations
  modifiers.forEach(modifier => {
    suggestions.push(`${modifier} ${baseKeyword}`);
    if (!baseKeyword.endsWith('s')) {
      suggestions.push(`${modifier} ${baseKeyword}s`);
    }
  });

  // Add some common question-based keywords
  const questions = ['what is', 'how to', 'why', 'when to'];
  questions.forEach(question => {
    suggestions.push(`${question} ${baseKeyword}`);
  });

  // Remove duplicates and limit to 5-8 suggestions (excluding the original)
  const uniqueSuggestions = [...new Set(suggestions)];
  const filteredSuggestions = uniqueSuggestions.filter(s => s !== baseKeyword);

  // Return 5-8 suggestions
  return filteredSuggestions.slice(0, Math.min(8, Math.max(5, filteredSuggestions.length)));
};