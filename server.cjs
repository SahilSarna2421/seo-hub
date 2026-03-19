const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });
    const html = response.data;

    const $ = cheerio.load(html);

    const title = $("title").text() || null;
    const metaDescription = $('meta[name="description"]').attr("content") || null;

    const h1Count = $("h1").length;

    const images = $("img");
    const totalImages = images.length;

    let imagesWithoutAlt = 0;
    images.each((i, el) => {
      if (!$(el).attr("alt")) {
        imagesWithoutAlt++;
      }
    });

    const totalLinks = $("a").length;

    const text = $("body").text();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    let score = 100;

    if (!title) score -= 20;
    if (!metaDescription) score -= 20;
    if (h1Count !== 1) score -= 10;
    if (imagesWithoutAlt > 0) score -= 10;
    if (wordCount < 300) score -= 20;

    const report = {
      id: Date.now().toString(),
      url,
      seo_score: score,
      title,
      meta_description: metaDescription,
      h1_count: h1Count,
      images_without_alt: imagesWithoutAlt,
      total_images: totalImages,
      total_links: totalLinks,
      word_count: wordCount,
      suggestions: [],
      created_at: new Date().toISOString(),
    };

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze website" });
  }
});

app.listen(5000, () => {
  console.log("SEO analyzer server running on port 5000");
});