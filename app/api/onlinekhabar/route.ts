import * as cheerio from "cheerio";

// Cache the route for 1 hour (3600 seconds)
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    console.log(url, "URL");

    if (!url) {
      return Response.json(
        { ok: false, error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      cache: "force-cache",
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("h1").first().text();
    const ai_summaries = $(".ai_summary_block_list li")
      .map((_, el) => $(el).text().trim())
      .get();

    const author = $(".ok-news-author .author-name").text().trim();
    const dateTime = $(".ok-news-post-hour span").text().trim();

    const excerpt = $(".sgexcerpt p").text().trim();

    const newsDescription = $('p[style*="text-align: justify"], .rich-para')
      .map((_, el) => $(el).text().trim())
      .get();

    const postTags = $(".ok-post-tags a")
      .map((_, el) => $(el).text().trim())
      .get();

    const postThumbnail = $(".post-thumbnail img").attr("src");

    const images: {
      src: string;
      caption: string | null;
      type: "paragraph" | "figure";
    }[] = [];

    // 1️⃣ Handle images inside <p style="text-align: justify">
    $('p[style*="text-align: justify"] img').each((_, el) => {
      images.push({
        src: $(el).attr("src") || "",
        caption: null, // no caption for <p> images
        type: "paragraph",
      });
    });

    // 2️⃣ Handle images inside <figure> (with optional <figcaption>)
    $("figure").each((_, el) => {
      const src = $(el).find("img").attr("src") || "";
      const caption = $(el).find("figcaption").text().trim() || null;

      if (src) {
        images.push({
          src,
          caption,
          type: "figure",
        });
      }
    });

    return Response.json(
      {
        ok: true,
        data: {
          title,
          author,
          dateTime,
          ai_summaries,
          excerpt,
          newsDescription,
          postTags,
          postThumbnail,
          images,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing news:", error);
    return Response.json(
      { ok: false, error: "Failed to parse news article" },
      { status: 500 }
    );
  }
}
