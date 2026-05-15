export class GetOrderUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute(id) {
    return await this.repo.findById(id);
  }
}