import { container } from '@/lib/container';
import { ScreenAvailabilityCache } from '@/lib/availability/ScreenAvailabilityCache';

export const seedScreenAvailability = async () => {
  const cache = container.resolve(ScreenAvailabilityCache);

  await cache.setScreenAvailability(1, [
    { id: 1, available: true },
    { id: 2, available: true },
    { id: 3, available: true },
    { id: 4, available: true },
    { id: 5, available: true },
    { id: 6, available: true },
    { id: 7, available: false },
    { id: 8, available: false },
    { id: 9, available: true },
    { id: 10, available: true },
    { id: 11, available: true },
    { id: 12, available: true },
    { id: 13, available: true },
    { id: 14, available: true },
    { id: 15, available: true },
    { id: 16, available: true },
  ]);
};