export class CreateReviewUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(bookId, userId, content) {
    return await this.repo.create({
      book_id: bookId,
      user_id: userId,
      content,
    });
  }
}