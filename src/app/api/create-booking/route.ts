import { NextResponse } from 'next/server';
import { container } from '@/lib/container';
import { ScreenAvailabilityCache } from '@/lib/availability/ScreenAvailabilityCache';
import { ReserveBookingCommand } from '@/lib/queue/commands/ReserveBookingCommand';

export async function POST(request: Request) {
  const { screenId, seatId } = await request.json();

  const screenAvailabilityCache = container.resolve(ScreenAvailabilityCache);
  const seatAvailability = await screenAvailabilityCache.getSeatAvailability(screenId, seatId);
  if (!seatAvailability) {
    return NextResponse.json({ error: 'Seat not found' }, { status: 404 });
  }
  if (!seatAvailability.available) {
    return NextResponse.json({ error: 'Seat not available' }, { status: 400 });
  }

  const reserveBookingCommand = container.resolve(ReserveBookingCommand);
  await reserveBookingCommand.execute(screenId, seatId);

  return NextResponse.json({ message: 'Booking reserved' });
}
