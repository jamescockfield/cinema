import { injectable, inject } from 'tsyringe';
import { ScreenAvailabilityUpdater } from '@/lib/availability/ScreenAvailabilityUpdater';

@injectable()
export class ReserveBookingHandler {
  constructor(@inject(ScreenAvailabilityUpdater) private readonly updater: ScreenAvailabilityUpdater) {}

  async handleReserveBooking(screenId: number, seatId: number): Promise<void> {
    await this.updater.updateSeatAvailability(screenId, seatId, false);
  }
}
