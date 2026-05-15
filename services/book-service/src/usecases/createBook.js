export class CreateBookUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(title, author) {
    return await this.repository.create(title, author);
  }
}