import { NextResponse } from 'next/server';
import { getDb, Batch } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    await db.read();
    return NextResponse.json({
      success: true,
      batches: db.data.batches,
      bookings: db.data.bookings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Batch = await req.json();
    const db = await getDb();
    await db.read();

    // Check duplicate
    const existingIndex = db.data.batches.findIndex((b) => b.id === body.id);
    if (existingIndex >= 0) {
      db.data.batches[existingIndex] = body;
    } else {
      db.data.batches.unshift(body);
    }

    await db.write();
    return NextResponse.json({ success: true, batches: db.data.batches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
