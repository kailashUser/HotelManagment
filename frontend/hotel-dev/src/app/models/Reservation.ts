export interface Reservation {
  id: number;
  CustomerId: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  guests: number;
}
