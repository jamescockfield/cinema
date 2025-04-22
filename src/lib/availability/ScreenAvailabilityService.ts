import { Seat } from "@/types/types";
import { RedisClient } from "../redis/RedisClient";
import { injectable } from "tsyringe";

@injectable()
export class ScreenAvailabilityService {
    constructor(private readonly redisClient: RedisClient) {}

    async getSeatAvailability(screenId: number): Promise<Seat[]> {
        const key = `screen:${screenId}:availability`;
        const cachedAvailability = await this.redisClient.get(key);

        if (cachedAvailability) {
            return JSON.parse(cachedAvailability);
        }
        return [];
    }

    async updateSeatAvailability(screenId: number, seatId: number, available: boolean): Promise<void> {
        const key = `screen:${screenId}:availability`;
        const availability = await this.getSeatAvailability(screenId);
        const seat = availability.find(seat => seat.id === seatId);
        if (seat) {
            seat.available = available;
        } else {
            availability.push({ id: seatId, available });
        }
        await this.redisClient.set(key, JSON.stringify(availability));
    }
}

