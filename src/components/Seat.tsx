'use client';

import { Seat as SeatType } from '@/types/types';

export const Seat = ({ id, available }: SeatType) => {
    return (
        <div className={`w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center ${!available ? 'bg-red-500' : ''}`}>
            {id}
        </div>
    )
}