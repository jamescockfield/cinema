'use client';

import { Modal } from '@/components/Modal';
import { ReserveBooking } from './ReserveBooking';

export enum BookingStage {
  SELECT_SEAT = 'SELECT_SEAT',
  CONFIRM_DETAILS = 'CONFIRM_DETAILS',
  PAYMENT = 'PAYMENT',
  CONFIRMATION = 'CONFIRMATION'
}

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number;
  onBook: () => void;
}

export const BookingFlowModal = ({
  isOpen,
  onClose,
  seatId,
  onBook,
}: BookingFlowModalProps) => {
  // For now, we'll just show the SELECT_SEAT stage
  const currentStage = BookingStage.SELECT_SEAT;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {currentStage === BookingStage.SELECT_SEAT ? (
        <ReserveBooking
          seatId={seatId}
          onBook={onBook}
          onCancel={onClose}
        />
      ) : null}
    </Modal>
  );
};
