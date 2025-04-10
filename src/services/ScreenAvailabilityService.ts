import { Seat } from "@/types/types";

export class ScreenAvailabilityService {
    private static instance: ScreenAvailabilityService;

    private constructor() {}

    static getInstance(): ScreenAvailabilityService {
        if (!ScreenAvailabilityService.instance) {
            ScreenAvailabilityService.instance = new ScreenAvailabilityService();
        }
        return ScreenAvailabilityService.instance;
    }

    getSeatAvailability(screenId: number): Seat[] {
        return [
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
            { id: 17, available: true },
            { id: 18, available: true },
            { id: 19, available: true },
        ];
    }
}

