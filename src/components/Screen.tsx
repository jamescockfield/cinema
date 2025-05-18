'use client';

import { Seat } from './Seat';
import { useSeatAvailability } from '@/hooks/useSeatAvailability';

interface ScreenProps {
  screenId: number;
}

export const Screen = ({ screenId }: ScreenProps) => {
  const seats = useSeatAvailability(screenId);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold">Screen {screenId}</h1>
      <div className="w-[60%] grid grid-cols-12 gap-4 my-5">
        {seats.map((seat) => (
          <Seat
            key={seat.id}
            screenId={screenId}
            seatId={seat.id}
            available={seat.available}
          />
        ))}
      </div>
    </div>
  );
};
