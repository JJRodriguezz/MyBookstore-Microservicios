export class CreateOrderUseCase {
  constructor(orderRepo, userClient, bookClient, inventoryClient, paymentClient) {
    this.orderRepo = orderRepo;
    this.userClient = userClient;
    this.bookClient = bookClient;
    this.inventoryClient = inventoryClient;
    this.paymentClient = paymentClient; // 🔥 ESTA LÍNEA ES CLAVE
  }

  async execute(userId, bookId) {

    const user = await this.userClient.getUser(userId);
    if (!user) throw new Error("User not found");

    const book = await this.bookClient.getBook(bookId);
    if (!book) throw new Error("Book not found");

    const stock = await this.inventoryClient.checkStock(bookId);
    if (!stock.available) throw new Error("No stock available");

    // 🔥 AQUÍ FALLABA
    const payment = await this.paymentClient.processPayment(userId, bookId);
    if (!payment.success) throw new Error("Payment failed");

    await this.inventoryClient.decreaseStock(bookId);

    return await this.orderRepo.create({
      user_id: userId,
      book_id: bookId,
    });
  }
}