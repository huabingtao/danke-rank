import { NextResponse } from 'next/server';
import { getDb, INITIAL_BATCHES } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({ action: 'reset' }));
    const db = await getDb();
    await db.read();

    if (action === 'clear') {
      // Clear all batches & bookings
      db.data.batches = [];
      db.data.bookings = {};
    } else {
      // Reset to initial 4 preset batches
      db.data.batches = INITIAL_BATCHES;
      db.data.bookings = {};
    }

    await db.write();
    return NextResponse.json({
      success: true,
      batches: db.data.batches,
      bookings: db.data.bookings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
