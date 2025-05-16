import { SQSEvent, SQSRecord, Context } from 'aws-lambda';
import { container } from '@/lib/container';
import { ReserveBookingHandler } from './ReserveBookingHandler';

export const handler = async (event: SQSEvent, context: Context): Promise<void> => {
  const reserveBookingHandler = container.resolve(ReserveBookingHandler);

  // Process each message in the batch
  await Promise.all(event.Records.map(async (record: SQSRecord) => {
    try {
      const body = JSON.parse(record.body);
      const { screenId, seatId } = body;

      if (!screenId || !seatId) {
        console.error('Invalid message format:', record.body);
        return;
      }

      await reserveBookingHandler.handleReserveBooking(
        parseInt(screenId),
        parseInt(seatId)
      );
    } catch (error) {
      console.error('Error processing SQS message:', error, 'Message:', record.body);
      // Note: We don't throw here to allow other messages in the batch to be processed
      // The message will return to the queue if not deleted
    }
  }));
}; 