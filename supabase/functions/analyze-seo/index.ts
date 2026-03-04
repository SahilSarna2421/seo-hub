const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Fetching URL:', formattedUrl);

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'SEOToolkit/1.0',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch: ${response.status}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    // Parse SEO elements
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i)
      || html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;

    const h1Matches = html.match(/<h1[\s>]/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;

    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const totalImages = imgMatches.length;
    const imagesWithoutAlt = imgMatches.filter(
      (img: string) => !img.match(/alt=["'][^"']+["']/i)
    ).length;

    const linkMatches = html.match(/<a[\s][^>]*href/gi);
    const totalLinks = linkMatches ? linkMatches.length : 0;

    // Strip HTML for word count
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = textContent.split(/\s+/).filter((w: string) => w.length > 0).length;

    // Calculate score
    let score = 0;
    const suggestions: string[] = [];

    // Title (20 pts)
    if (title) {
      if (title.length >= 30 && title.length <= 60) score += 20;
      else { score += 10; suggestions.push(`Title length is ${title.length} chars. Ideal is 30-60 characters.`); }
    } else {
      suggestions.push('Add a title tag to your page.');
    }

    // Meta description (20 pts)
    if (metaDescription) {
      if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
      else { score += 10; suggestions.push(`Meta description is ${metaDescription.length} chars. Ideal is 120-160 characters.`); }
    } else {
      suggestions.push('Add a meta description to improve search appearance.');
    }

    // H1 (20 pts)
    if (h1Count === 1) score += 20;
    else if (h1Count === 0) suggestions.push('Add exactly one H1 tag to your page.');
    else { score += 10; suggestions.push(`Found ${h1Count} H1 tags. Use exactly one for best SEO.`); }

    // Images (20 pts)
    if (totalImages === 0) { score += 20; }
    else if (imagesWithoutAlt === 0) score += 20;
    else { score += Math.max(0, 20 - imagesWithoutAlt * 4); suggestions.push(`${imagesWithoutAlt} image(s) missing alt attributes.`); }

    // Word count (20 pts)
    if (wordCount >= 300) score += 20;
    else if (wordCount >= 100) { score += 10; suggestions.push(`Page has ${wordCount} words. Aim for 300+ for better rankings.`); }
    else { suggestions.push(`Very low word count (${wordCount}). Add more content.`); }

    score = Math.min(100, Math.max(0, score));

    const report = {
      url: formattedUrl,
      seo_score: score,
      title,
      meta_description: metaDescription,
      h1_count: h1Count,
      images_without_alt: imagesWithoutAlt,
      total_images: totalImages,
      total_links: totalLinks,
      word_count: wordCount,
      suggestions,
    };

    console.log('Analysis complete, score:', score);

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Analysis failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
