import { createBooking } from '@/lib/booking/createBooking';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { screenId, seatId } = await request.json();
  const booking = await createBooking(screenId, seatId);
  return NextResponse.json(booking);
}
