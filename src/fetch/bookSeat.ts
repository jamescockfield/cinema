export const bookSeat = async (screenId: number, seatId: number) => {
    const response = await fetch(`/api/create-booking`, {
        method: 'POST',
        body: JSON.stringify({ screenId, seatId }),
    });
    return response.json();
}
