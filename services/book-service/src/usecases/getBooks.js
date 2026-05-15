export class GetBooksUseCase {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute() {
    return await this.bookRepository.findAll();
  }
}