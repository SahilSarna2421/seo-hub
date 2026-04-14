const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ===========================
   🔍 WEBSITE ANALYZER
=========================== */
app.post("/analyze", async (req, res) => {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const startTime = Date.now();

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 10000,
    });

    const loadTime = Date.now() - startTime;

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim() || null;

    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || null;

    const h1Tags = $("h1").map((i, el) => $(el).text().trim()).get();
    const h1Count = h1Tags.length;
    const h2Count = $("h2").length;
    const h3Count = $("h3").length;

    const headingAnalysis = {
      h1: h1Count,
      h2: h2Count,
      h3: h3Count,
      issues: [],
    };

    if (h1Count === 0) headingAnalysis.issues.push("Missing H1 tag");
    if (h1Count > 1) headingAnalysis.issues.push("Multiple H1 tags");
    if (h2Count === 0) headingAnalysis.issues.push("No H2 tags found");

    const images = $("img");
    const totalImages = images.length;

    let imagesWithoutAlt = 0;
    images.each((i, el) => {
      const alt = $(el).attr("alt");
      if (!alt || alt.trim() === "") {
        imagesWithoutAlt++;
      }
    });

    const links = $("a");
    const totalLinks = links.length;

    let internalLinks = 0;
    let externalLinks = 0;
    const linkList = [];

    links.each((i, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      linkList.push(href);

      if (
        href.startsWith("/") ||
        href.includes(new URL(url).hostname)
      ) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    });

    const brokenLinks = [];
    const linksToCheck = linkList.slice(0, 15);

    await Promise.all(
      linksToCheck.map(async (link) => {
        try {
          if (!link.startsWith("http")) return;

          const res = await axios.head(link, { timeout: 3000 });
          if (res.status >= 400) {
            brokenLinks.push(link);
          }
        } catch {
          brokenLinks.push(link);
        }
      })
    );

    const text = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = text ? text.split(" ").length : 0;

    const stopWords = new Set([
      "the","is","in","and","to","of","a","for","on","with","as","by","an","at","be","this","that","it","from","or","are"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    const freqMap = {};
    words.forEach(word => {
      freqMap[word] = (freqMap[word] || 0) + 1;
    });

    const keywordDensity = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        keyword: word,
        count,
        density: ((count / words.length) * 100).toFixed(2)
      }));

    const hasViewport = $('meta[name="viewport"]').length > 0;

    const suggestions = [];

    if (!title) suggestions.push("Missing title tag");
    if (!metaDescription) suggestions.push("Missing meta description");
    if (h1Count === 0) suggestions.push("No H1 tag found");
    if (wordCount < 300) suggestions.push("Content is too short");
    if (imagesWithoutAlt > 0) suggestions.push("Images missing alt text");
    if (internalLinks < 3) suggestions.push("Not enough internal links");
    if (brokenLinks.length > 0) suggestions.push("Broken links detected");

    // Calculate category scores
    let metaTagsScore = 20;
    let contentScore = 30;
    let performanceScore = 20;
    let linksScore = 30;

    // Meta Tags scoring (20 points max)
    if (!title) metaTagsScore -= 10;
    if (!metaDescription) metaTagsScore -= 10;
    if (metaTagsScore < 0) metaTagsScore = 0;

    // Content scoring (30 points max)
    if (h1Count === 0) contentScore -= 10;
    else if (h1Count > 1) contentScore -= 5;
    if (wordCount < 300) contentScore -= 10;
    else if (wordCount >= 600) contentScore += 5; // Bonus for longer content
    if (imagesWithoutAlt > 0) contentScore -= 5;
    if (contentScore < 0) contentScore = 0;
    if (contentScore > 30) contentScore = 30;

    // Performance scoring (20 points max)
    if (loadTime > 3000) performanceScore -= 10;
    else if (loadTime > 2000) performanceScore -= 5;
    if (!hasViewport) performanceScore -= 5;
    if (performanceScore < 0) performanceScore = 0;

    // Links scoring (30 points max)
    if (totalLinks === 0) linksScore -= 15;
    else if (totalLinks < 5) linksScore -= 10;
    if (internalLinks < 3) linksScore -= 10;
    if (brokenLinks.length > 0) linksScore -= 5;
    if (linksScore < 0) linksScore = 0;

    // Calculate total score as sum of category scores
    let score = metaTagsScore + contentScore + performanceScore + linksScore;

    if (score < 0) score = 0;

    const report = {
      id: Date.now().toString(),
      url,
      seo_score: score,
      title,
      meta_description: metaDescription,
      h1_count: h1Count,
      h1_tags: h1Tags,
      h2_count: h2Count,
      h3_count: h3Count,
      heading_analysis: headingAnalysis,
      total_images: totalImages,
      images_without_alt: imagesWithoutAlt,
      total_links: totalLinks,
      internal_links: internalLinks,
      external_links: externalLinks,
      broken_links: brokenLinks.length,
      broken_links_list: brokenLinks,
      word_count: wordCount,
      keyword_density: keywordDensity,
      has_viewport: hasViewport,
      load_time_ms: loadTime,
      score_breakdown: {
        meta_tags: { score: metaTagsScore, max: 20 },
        content: { score: contentScore, max: 30 },
        performance: { score: performanceScore, max: 20 },
        links: { score: linksScore, max: 30 }
      },
      suggestions,
      created_at: new Date().toISOString(),
    };

    res.json(report);

  } catch (error) {
    console.error("ERROR:", error.message);

    res.status(500).json({
      error: "Failed to analyze website",
      details: error.message,
    });
  }
});

/* ===========================
   ✍️ CONTENT OPTIMIZER (REALISTIC SCORING 🔥)
=========================== */
app.post("/optimize", (req, res) => {
  try {
    const { keyword, content } = req.body;

    if (!keyword || !content) {
      return res.status(400).json({
        error: "Keyword and content are required"
      });
    }

    const text = content.toLowerCase();
    const keywordLower = keyword.toLowerCase().trim();

    const cleanText = text.replace(/[^\w\s]/g, " ");
    const words = cleanText.split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, "g");

    const matches = text.match(regex);
    const keywordCount = matches ? matches.length : 0;

    const density =
      totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;

    const first100Words = words.slice(0, 100).join(" ");
    const keywordInStart = first100Words.includes(keywordLower);

    const hasHeading =
      content.includes("#") || content.includes("<h");

    const suggestions = [];

    let score = 100;

    // Density
    if (density < 0.5) {
      score -= 10;
      suggestions.push("Increase keyword usage (too low)");
    } else if (density > 5) {
      score -= 15;
      suggestions.push("Reduce keyword usage (keyword stuffing)");
    } else if (density >= 1 && density <= 3) {
      score += 5;
    }

    // Position
    if (!keywordInStart) {
      score -= 10;
      suggestions.push("Include keyword in first 100 words");
    } else {
      score += 5;
    }

    // Headings
    if (!hasHeading) {
      score -= 10;
      suggestions.push("Add headings to improve structure");
    } else {
      score += 5;
    }

    // Length
    if (totalWords < 300) {
      score -= 10;
      suggestions.push("Content is too short (min 300 words)");
    } else if (totalWords > 600) {
      score += 5;
    }

    // 🔥 REALISTIC CAP
    if (score > 95) score = 95;
    if (score < 0) score = 0;

    // Calculate readability metrics
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalSentences = sentences.length;
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    const averageWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;
    const readabilityScore = Math.max(0, Math.min(100, Math.round(100 - (averageWordsPerSentence * 1.5))));

    res.json({
      keyword,
      total_words: totalWords,
      keyword_count: keywordCount,
      keyword_density: density.toFixed(2),
      keyword_in_start: keywordInStart,
      has_headings: hasHeading,
      score,
      suggestions,
      readability: {
        score: readabilityScore,
        total_sentences: totalSentences,
        total_words: totalWords,
        average_words_per_sentence: Math.round(averageWordsPerSentence * 100) / 100,
        label: readabilityScore >= 70 ? "Easy" : readabilityScore >= 40 ? "Medium" : "Hard"
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to optimize content"
    });
  }
});

app.listen(5000, () => {
  console.log("SEO analyzer server running on port 5000");
});