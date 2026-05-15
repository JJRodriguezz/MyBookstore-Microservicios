export class ProcessPaymentUseCase {
  async execute(userId, bookId) {

    // simulación de pago
    if (!userId || !bookId) {
      return { success: false, message: "Invalid payment data" };
    }

    return {
      success: true,
      message: "Payment processed successfully"
    };
  }
}