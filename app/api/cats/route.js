import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side client with Service Role Key (never exposed to frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const lat = parseFloat(searchParams.get('lat'));
    const lon = parseFloat(searchParams.get('lng'));
    const count = parseInt(searchParams.get('count') || '5', 10);
    const q = searchParams.get('q');

    // Validate coordinates if provided
    if ((lat && isNaN(lat)) || (lon && isNaN(lon))) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 },
      );
    }

    let cats;

    // If lat/lon are provided, fetch closest cats via RPC
    if (!isNaN(lat) && !isNaN(lon)) {
      const { data, error } = await supabase.rpc('get_closest_cats', {
        lat,
        lon,
        radius: count,
      });

      if (error) {
        console.error('RPC get_closest_cats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      cats = data;
    } else {
      // Otherwise, fetch a limited number of cats
      const { data, error } = await supabase
        .from('cats')
        .select('id, name, breed, age, description, pic, owner')
        .limit(count);

      if (error) {
        console.error('Supabase select error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      cats = data;
    }

    // Optional text search filter
    if (q) {
      const query = q.toLowerCase();
      cats = cats.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(query) ||
          cat.breed?.toLowerCase().includes(query) ||
          cat.description?.toLowerCase().includes(query),
      );
    }

    return NextResponse.json({ cats, totalCats: cats.length });
  } catch (err) {
    console.error('Unexpected error fetching cats:', err);
    return NextResponse.json(
      { error: 'Failed to fetch cats' },
      { status: 500 },
    );
  }
}
