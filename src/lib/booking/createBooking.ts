import { Redis } from 'ioredis';
import { container } from '../../container';
import { ScreenAvailabilityService } from '../availability/ScreenAvailabilityService';
import { RedisClient } from '../redis/RedisClient';
import { WebSocketServer } from '../websocket/WebSocketServer';

export const createBooking = async (screenId: number, seatId: number) => {
  const screenAvailabilityService = container.resolve(ScreenAvailabilityService);
  const seatAvailability = await screenAvailabilityService.getSeatAvailability(screenId);
  const seat = seatAvailability.find((seat: { id: number; available: boolean }) => seat.id === seatId);
  if (!seat) {
    return {
      success: false,
      message: 'Seat not found',
    };
  }
  if (!seat.available) {
    return {
      success: false,
      message: 'Seat not available',
    };
  }

  await screenAvailabilityService.updateSeatAvailability(screenId, seatId, false);

  return {
    success: true,
    message: 'Seat reserved successfully',
  };
};
