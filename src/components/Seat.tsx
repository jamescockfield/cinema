'use client';

import { useState } from 'react';
import { BookingFlowModal } from './booking-flow/BookingFlowModal';
import { bookSeat } from '@/fetch/bookSeat';

interface SeatProps {
  screenId: number;
  seatId: number;
  available: boolean;
}

export const Seat = ({ screenId, seatId, available }: SeatProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (available) {
      setIsModalOpen(true);
    }
  };

  const handleBook = async () => {
    const response = await bookSeat(screenId, seatId);
    if (response.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={`w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center cursor-pointer ${
          !available ? 'bg-red-500 cursor-not-allowed' : 'hover:bg-gray-400'
        }`}
        onClick={handleClick}
      >
        {seatId}
      </div>
      <BookingFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        seatId={seatId}
        onBook={handleBook}
      />
    </>
  );
};
