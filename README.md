# Nepali News Parser API

A Next.js API service that parses and extracts structured data from Nepali news articles.

> **Current Status**: Currently supports **OnlineKhabar** only. Support for additional news portals (Kantipur, Himalayan Times, Ratopati, etc.) is planned and **contributions are welcome**!

## Features

- 🚀 Fast and efficient news article parsing
- 📰 **Supported News Sources**: OnlineKhabar (more coming soon!)
- 📰 Extracts comprehensive article data including:
  - Article title and excerpt
  - Author information
  - Publication date/time
  - AI-generated summaries
  - Full article content
  - Images with captions
  - Article tags
  - Thumbnail images
- ⚡ Built-in caching (1-hour revalidation)
- 🔄 RESTful API interface
- 📦 Type-safe with TypeScript

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: Node.js
- **Parser**: [Cheerio](https://cheerio.js.org/) - Fast, flexible HTML parsing
- **Language**: TypeScript
- **Styling**: TailwindCSS 4

## Prerequisites

- Node.js 18+ or Bun runtime
- npm, yarn, pnpm, or bun package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nepali-news-parser-api.git
cd nepali-news-parser-api
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The API will be available at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Base Route

```
GET /api
```

Returns a simple "Hello, world!" message to verify the API is running.

### OnlineKhabar Parser

> **Note**: This is currently the only supported news source. Want to add support for another portal? See [Contributing](#contributing) section below!

```
GET /api/onlinekhabar?url=<article_url>
```

Parses an OnlineKhabar news article and returns structured data.

#### Parameters

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `url`     | string | Yes      | The full URL of the OnlineKhabar article |

#### Response Schema

```typescript
{
  ok: boolean,
  data?: {
    title: string,                    // Article headline
    author: string,                   // Article author name
    dateTime: string,                 // Publication date/time
    ai_summaries: string[],          // AI-generated summary points
    excerpt: string,                  // Article excerpt/summary
    newsDescription: string[],        // Array of article paragraphs
    postTags: string[],              // Article tags
    postThumbnail: string | undefined, // Main thumbnail image URL
    images: Array<{                   // All images in the article
      src: string,
      caption: string | null,
      type: "paragraph" | "figure"
    }>
  },
  error?: string                      // Error message if request failed
}
```

#### Example Request

```bash
curl "http://localhost:3000/api/onlinekhabar?url=https://www.onlinekhabar.com/article/123456"
```

#### Example Response

```json
{
  "ok": true,
  "data": {
    "title": "Sample News Article Title",
    "author": "John Doe",
    "dateTime": "2025-11-07 12:30",
    "ai_summaries": ["Key point 1", "Key point 2", "Key point 3"],
    "excerpt": "This is the article excerpt...",
    "newsDescription": [
      "First paragraph of the article...",
      "Second paragraph of the article..."
    ],
    "postTags": ["politics", "news", "breaking"],
    "postThumbnail": "https://example.com/image.jpg",
    "images": [
      {
        "src": "https://example.com/image1.jpg",
        "caption": "Image caption here",
        "type": "figure"
      }
    ]
  }
}
```

#### Error Responses

**400 Bad Request** - Missing URL parameter:

```json
{
  "ok": false,
  "error": "URL parameter is required"
}
```

**500 Internal Server Error** - Failed to parse article:

```json
{
  "ok": false,
  "error": "Failed to parse news article"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
nepali-news-parser-api/
├── app/
│   ├── api/
│   │   ├── onlinekhabar/
│   │   │   └── route.ts          # OnlineKhabar parser endpoint
│   │   └── route.ts               # Base API route
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── public/                        # Static assets
├── static/                        # Sample HTML files
├── package.json
├── tsconfig.json
└── README.md
```

## Caching

The API implements smart caching with a 1-hour revalidation period to improve performance and reduce server load. Parsed articles are cached using Next.js's built-in caching mechanism.

## Supported News Portals

| News Portal     | Status       | Endpoint            |
| --------------- | ------------ | ------------------- |
| OnlineKhabar    | ✅ Supported | `/api/onlinekhabar` |
| Kantipur        | 🔜 Planned   | -                   |
| Himalayan Times | 🔜 Planned   | -                   |
| Ratopati        | 🔜 Planned   | -                   |
| Setopati        | 🔜 Planned   | -                   |
| Annapurna Post  | 🔜 Planned   | -                   |

**Want to add support for your favorite news portal?** Contributions are welcome! See the [Contributing](#contributing) section below.

## Future Enhancements

- [ ] **Add support for more Nepali news sources** (Help wanted! 🙌)
- [ ] Add article search functionality
- [ ] Add API authentication
- [ ] Batch article parsing

## Contributing

Contributions are **highly encouraged**! Whether you want to add support for a new news portal, fix bugs, or improve documentation - all contributions are welcome.

### Adding a New News Portal

To add support for a new Nepali news portal:

1. **Fork the repository**

2. **Create a new API route** under `app/api/[news-portal-name]/route.ts`

   - Use `app/api/onlinekhabar/route.ts` as a reference
   - Implement the same response schema for consistency

3. **Parse the HTML structure**

   - Inspect the news portal's HTML structure
   - Use Cheerio to extract: title, author, dateTime, content, images, tags, etc.
   - Test with multiple articles to ensure consistency

4. **Add tests** (if applicable)

5. **Update the README**

   - Add the new portal to the [Supported News Portals](#supported-news-portals) table
   - Add API documentation for the new endpoint

6. **Submit a Pull Request**
   - Include sample article URLs for testing
   - Describe what fields are supported

### General Contribution Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AddKantipurSupport`)
3. Commit your changes (`git commit -m 'Add support for Kantipur news portal'`)
4. Push to the branch (`git push origin feature/AddKantipurSupport`)
5. Open a Pull Request with a clear description

### Need Help?

If you're interested in contributing but need guidance, feel free to:

- Open an issue to discuss your ideas
- Ask questions in the discussions section
- Check out the existing code structure in `app/api/onlinekhabar/route.ts`

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

README beautifully generated by Cursor, reviewed by @cypherab01.
