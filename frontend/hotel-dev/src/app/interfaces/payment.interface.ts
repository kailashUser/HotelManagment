export interface PaymentPost {
    billingId: number;
    amount: number;
    method: number; // 0: cash, 1: card, etc.
    status: number; // 1: completed, 2: pending, etc.
    transactionId: string;
    cardNumber: string;
    cardHolderName: string;
    cardExpiryDate: string;
}
