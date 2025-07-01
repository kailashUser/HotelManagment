export interface Room {
  id: number;
  name: string; // from RoomNumber
  type: string;
  price: number; // from basePrice
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean; // from isAvailable
}
