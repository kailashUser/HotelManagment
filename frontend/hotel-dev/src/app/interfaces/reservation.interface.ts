export interface Reservation {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  source: 'customer' | 'travelCompany';
  sourceId: number;
  status: string;
  addOns: {
    breakfast: boolean;
    wifi: boolean;
    parking: boolean;
  };
  stayCharges: number;
  taxes: number;
  totalAmount: number;
} 