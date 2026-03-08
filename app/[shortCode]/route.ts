import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode, incrementLinkClicks } from '@/data/links';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  // Fetch the link by short code
  const link = await getLinkByShortCode(shortCode);

  // If link not found, return 404
  if (!link) {
    return new NextResponse('Link not found', { status: 404 });
  }

  // Increment the click counter
  await incrementLinkClicks(shortCode);

  // Redirect to the original URL
  return NextResponse.redirect(link.originalUrl, { status: 307 });
}
