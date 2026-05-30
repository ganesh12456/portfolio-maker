import { NextRequest, NextResponse } from 'next/server';
import { parseJobDescriptionText } from '@/lib/job-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content } = body as { type: 'text' | 'url'; content: string };

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let textContent = content;

    if (type === 'url') {
      try {
        const response = await fetch(content, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PortfolioEngine/1.0)',
          },
        });
        if (!response.ok) {
          return NextResponse.json(
            { error: `Failed to fetch URL: ${response.status}` },
            { status: 400 }
          );
        }
        const html = await response.text();
        // Strip HTML tags and extract text
        textContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#\d+;/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      } catch {
        return NextResponse.json(
          { error: 'Failed to fetch the provided URL' },
          { status: 400 }
        );
      }
    }

    const parsed = parseJobDescriptionText(textContent);
    return NextResponse.json({ parsed });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
