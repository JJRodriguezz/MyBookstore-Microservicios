export class CheckStockUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(bookId) {
    const item = await this.repo.findByBookId(bookId);

    if (!item) return { available: false, quantity: 0 };

    return {
      available: item.quantity > 0,
      quantity: item.quantity,
    };
  }
}