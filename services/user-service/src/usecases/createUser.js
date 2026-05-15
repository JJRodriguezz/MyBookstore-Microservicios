export class CreateUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(name, email) {
    return await this.repository.create(name, email);
  }
}