'use client';

import { Modal } from './Modal';

interface SeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number;
  onBook: () => void;
}

export const SeatModal = ({
  isOpen,
  onClose,
  seatId,
  onBook,
}: SeatModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Seat {seatId}</h2>
        <p className="mb-4">Would you like to book this seat?</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onBook}
          >
            Book Now
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
