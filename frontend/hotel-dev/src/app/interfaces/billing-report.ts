export interface BillingReport {
  customerName: string;
  email: string;
  phoneNumber: string;

  roomNumber: string;
  roomType: number;
  basePrice: number;

  checkInDate: string;
  checkOutDate: string;
  nights: number;
  depositAmount: number;

  reservationStatus: number;

  roomCharges: number;
  tax: number;
  discount: number;
  additionalCharges: number;
  amountDue: number;

  amountPaid: number | null;
  paymentMethod: number | null;
  paymentStatus: number | null;
  transactionId: string | null;
  processedAt: string | null;
}
