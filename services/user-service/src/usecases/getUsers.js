export class GetUsersUseCase {
  constructor(repo) {
    this.repo = repo;
  }

  async execute() {
    return await this.repo.findAll();
  }
}