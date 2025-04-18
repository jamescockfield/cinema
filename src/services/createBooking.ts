import { container } from "../container";

export const createBooking = async (screenId: number, seatId: number) => {
    const screenAvailabilityService = container.getScreenAvailability();
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
}
