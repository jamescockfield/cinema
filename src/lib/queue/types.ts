export enum QueueMessageType {
  RESERVE_BOOKING = 'reserve_booking_message',
}

export interface QueueMessage {
  type: QueueMessageType;
  body: any;
  receiptHandle?: string;
}
