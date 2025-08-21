import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');
    const edition = searchParams.get('edition') || 'ar.alafasy';

    if (!surah || !ayah) {
      return new Response(JSON.stringify({ error: 'Missing required params: surah and ayah' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    // First fetch the verse metadata to get the audio URL from aiquran.cloud
    const metaRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`, {
      // Do not cache aggressively to respect upstream
      cache: 'no-store'
    });

    if (!metaRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch audio metadata' }), {
        status: metaRes.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    const meta = await metaRes.json();
    const audioUrl: string | undefined = meta?.data?.audio;

    if (!audioUrl) {
      return new Response(JSON.stringify({ error: 'Audio not available for this verse' }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Forward Range header for streaming support
    const range = req.headers.get('range') || undefined;

    const audioRes = await fetch(audioUrl, {
      headers: range ? { Range: range } : undefined,
    });

    // Stream back the response with relevant headers
    const headers = new Headers();
    // Copy commonly needed headers
    const copyHeaders = [
      'content-type',
      'content-length',
      'accept-ranges',
      'content-range',
      'cache-control',
      'etag',
      'last-modified'
    ];
    for (const h of copyHeaders) {
      const v = audioRes.headers.get(h);
      if (v) headers.set(h, v);
    }
    // Allow browsers to cache for a short period
    if (!headers.has('cache-control')) {
      headers.set('cache-control', 'public, max-age=3600');
    }

    return new Response(audioRes.body, {
      status: audioRes.status, // could be 200 or 206
      headers
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Audio proxy error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
} 