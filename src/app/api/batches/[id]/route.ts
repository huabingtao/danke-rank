import { NextResponse } from 'next/server';
import { getDb, Batch } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body: Partial<Batch> = await req.json();
    const db = await getDb();
    await db.read();

    const batchIndex = db.data.batches.findIndex((b) => b.id === id);
    if (batchIndex === -1) {
      return NextResponse.json({ success: false, error: '班次未找到' }, { status: 444 });
    }

    db.data.batches[batchIndex] = { ...db.data.batches[batchIndex], ...body };
    await db.write();

    return NextResponse.json({ success: true, batches: db.data.batches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const db = await getDb();
    await db.read();

    db.data.batches = db.data.batches.filter((b) => b.id !== id);

    // Also remove bookings belonging to this batch
    for (const openId of Object.keys(db.data.bookings)) {
      if (db.data.bookings[openId].batchId === id) {
        delete db.data.bookings[openId];
      }
    }

    await db.write();
    return NextResponse.json({ success: true, batches: db.data.batches, bookings: db.data.bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
