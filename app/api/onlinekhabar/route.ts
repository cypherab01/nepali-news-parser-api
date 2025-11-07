import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

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

    const imageUrls = $('p[style*="text-align: justify"] img')
      .map((_, el) => $(el).attr("src"))
      .get();

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
          imageUrls,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unexpected end of JSON input"
    ) {
      return Response.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }

    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
