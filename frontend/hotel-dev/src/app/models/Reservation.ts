export interface Reservation {
  id: number;
  CustomerId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'ongoing' | 'pending' | 'completed';
  totalPrice: number;
  guests: number;
}
