import type { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');
    const edition = searchParams.get('edition') || 'ar.alafasy';

    if (!surah || !ayah) {
      return new Response(JSON.stringify({ error: 'Missing required params: surah and ayah' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    // First fetch the verse metadata to get the global verse number
    const metaUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`;
    
    let metaRes;
    try {
      metaRes = await fetch(metaUrl, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'QuranLife/1.0',
          'Accept': 'application/json'
        }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(JSON.stringify({ error: 'Network error fetching metadata', details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    if (!metaRes.ok) {
      console.error('Metadata fetch failed:', metaRes.status, metaRes.statusText);
      return new Response(JSON.stringify({ error: 'Failed to fetch audio metadata', status: metaRes.status }), {
        status: metaRes.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    let meta;
    try {
      meta = await metaRes.json();
    } catch (jsonError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('JSON parse error:', jsonError);
      }
      return new Response(JSON.stringify({ error: 'Invalid JSON response from metadata API' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
    
    const verseNumber = meta?.data?.number;
    if (!verseNumber) {
      console.error('No verse number found in metadata');
      return new Response(JSON.stringify({ error: 'Verse number not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Construct the audio URL using the global verse number
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${edition}/${verseNumber}.mp3`;

    // Forward Range header for streaming support
    const range = req.headers.get('range') || undefined;

    let audioRes;
    try {
      audioRes = await fetch(audioUrl, {
        headers: range ? { Range: range } : undefined,
      });
    } catch (audioFetchError) {
      console.error('Audio fetch error:', audioFetchError);
      return new Response(JSON.stringify({ error: 'Network error fetching audio file', details: audioFetchError instanceof Error ? audioFetchError.message : 'Unknown audio fetch error' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    if (!audioRes.ok) {
      console.error('Audio fetch failed:', audioRes.status, audioRes.statusText);
      return new Response(JSON.stringify({ error: 'Failed to fetch audio file', status: audioRes.status }), {
        status: audioRes.status,
        headers: { 'content-type': 'application/json' }
      });
    }

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
    console.error('Audio API error:', err);
    return new Response(JSON.stringify({ error: 'Audio proxy error', details: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
} 