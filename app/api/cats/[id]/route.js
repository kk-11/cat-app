import { NextResponse } from 'next/server';
import { mockCats } from '../../../../data/cats.js';

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const cat = mockCats.find((c) => c.id === id);
    if (!cat) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }
    return NextResponse.json(cat);
  } catch (error) {
    console.error('Error fetching cat:', error);
    return NextResponse.json({ error: 'Failed to fetch cat' }, { status: 500 });
  }
}
