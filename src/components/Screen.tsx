'use client';

import { Seat } from "./Seat"
import { useSeatAvailability } from "@/hooks/useSeatAvailability"

export const Screen = () => {
    const seats = useSeatAvailability();

    return (
        <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold">Screen 1</h1>
            <div className="w-[60%] grid grid-cols-12 gap-4 my-5">
                {seats.map((seat) => <Seat key={seat.id} id={seat.id} available={seat.available} />)}
            </div>
        </div>
    )
}
