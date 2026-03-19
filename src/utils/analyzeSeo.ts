import axios from "axios";
import * as cheerio from "cheerio";

export const analyzeSeo = async (url: string) => {
const response = await axios.get(url);
const html = response.data;

const $ = cheerio.load(html);

const title = $("title").text() || null;

const metaDescription =
$('meta[name="description"]').attr("content") || null;

const h1Count = $("h1").length;

const images = $("img");
const totalImages = images.length;

let imagesWithoutAlt = 0;

images.each((_, img) => {
const alt = $(img).attr("alt");
if (!alt || alt.trim() === "") {
imagesWithoutAlt++;
}
});

const totalLinks = $("a").length;

const bodyText = $("body").text();
const wordCount = bodyText.split(/\s+/).length;

let score = 100;
const suggestions: string[] = [];

if (!title) {
score -= 20;
suggestions.push("Add a title tag.");
}

if (!metaDescription) {
score -= 20;
suggestions.push("Add a meta description.");
}

if (h1Count === 0) {
score -= 15;
suggestions.push("Add at least one H1 heading.");
}

if (imagesWithoutAlt > 0) {
score -= 10;
suggestions.push("Add alt text to images.");
}

if (wordCount < 300) {
score -= 15;
suggestions.push("Increase page content length.");
}

const report = {
id: crypto.randomUUID(),
url,
seo_score: Math.max(score, 0),
title,
meta_description: metaDescription,
h1_count: h1Count,
images_without_alt: imagesWithoutAlt,
total_images: totalImages,
total_links: totalLinks,
word_count: wordCount,
suggestions,
created_at: new Date().toISOString(),
};

return report;
};
