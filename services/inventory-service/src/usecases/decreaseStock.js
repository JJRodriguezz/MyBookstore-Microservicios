export class DecreaseStockUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(bookId) {
    const updated = await this.repo.decreaseStock(bookId);

    if (!updated) {
      return { available: false, quantity: 0 };
    }

    return {
      available: true,
      quantity: updated.quantity,
    };
  }
}