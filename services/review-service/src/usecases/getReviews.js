export class GetReviewsUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(bookId) {
    return await this.repo.findByBook(bookId);
  }
}