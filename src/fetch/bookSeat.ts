export const bookSeat = async (screenId: number, seatId: number) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const response = await fetch(`${API_URL}/api/create-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ screenId, seatId }),
  });
  return response.json();
};
