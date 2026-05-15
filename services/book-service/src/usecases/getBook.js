export class GetBookUseCase {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id) {
    return await this.bookRepository.findById(id);
  }
}