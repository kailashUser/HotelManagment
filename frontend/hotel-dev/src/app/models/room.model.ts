// Display-friendly room object for UI
export interface Room {
  description: string;
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean;
}

interface Rooms {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  available: boolean;
}


// Raw backend room response model
export interface RawRoom {
  id: number;
  roomNumber: string;
  type: number;
  basePrice: number;
  capacity: number;
  description?: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string | null;
}


export interface CreateRoomDto {
  roomNumber: string;
  type: number;
  basePrice: number;
  capacity: number;
  isAvailable: boolean;
  description?: string | null;
}
