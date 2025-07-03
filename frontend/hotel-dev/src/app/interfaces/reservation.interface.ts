export interface Reservation {
  id: number;
  customerId: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  roomId: number;
  roomName?: string | null;
  checkInDate: string;
  checkOutDate: string;
  actualCheckIn?: string | null;
  actualCheckOut?: string | null;
  status: number;
  totalAmount: number;
  depositAmount?: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string | null;
  paymentCompleted?: boolean;
  paymentDeadline?: string;
}

export interface CreateReservationDto {
  customerId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: number;
  totalAmount: number;
  depositAmount?: number;
  specialRequests?: string;
  createdAt: string;
  // Additional fields for enhanced reservation process
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  } | null;
}
