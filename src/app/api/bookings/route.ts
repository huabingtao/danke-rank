import { NextResponse } from 'next/server';
import { getDb, Booking } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { openId, batchId, userName, avatarUrl } = await req.json();
    if (!openId || !batchId) {
      return NextResponse.json({ success: false, error: '缺少必需参数' }, { status: 400 });
    }

    const db = await getDb();
    await db.read();

    const batch = db.data.batches.find((b) => b.id === batchId);
    if (!batch) {
      return NextResponse.json({ success: false, error: '班次不存在' }, { status: 404 });
    }

    // Check if user already booked a batch
    const oldBooking = db.data.bookings[openId];
    if (oldBooking) {
      // decrement old batch count
      const oldBatch = db.data.batches.find((b) => b.id === oldBooking.batchId);
      if (oldBatch) {
        oldBatch.currentCount = Math.max(0, oldBatch.currentCount - 1);
      }
    }

    // Book new batch
    const newBooking: Booking = {
      openId,
      batchId,
      userName: userName || '特工玩家',
      avatarUrl: avatarUrl || '/avatars/科萌.png',
      bookedAt: new Date().toISOString(),
    };

    db.data.bookings[openId] = newBooking;
    batch.currentCount = batch.currentCount + 1;

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

export async function DELETE(req: Request) {
  try {
    const { openId } = await req.json();
    if (!openId) {
      return NextResponse.json({ success: false, error: '缺少 openId' }, { status: 400 });
    }

    const db = await getDb();
    await db.read();

    const booking = db.data.bookings[openId];
    if (booking) {
      const batch = db.data.batches.find((b) => b.id === booking.batchId);
      if (batch) {
        batch.currentCount = Math.max(0, batch.currentCount - 1);
      }
      delete db.data.bookings[openId];
      await db.write();
    }

    return NextResponse.json({
      success: true,
      batches: db.data.batches,
      bookings: db.data.bookings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
