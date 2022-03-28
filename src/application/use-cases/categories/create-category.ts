import { ICategoriesRepository } from '../../repositories/categories.repository';

type CreateCategoryUseCaseRequest = {
  name: string;
};

export class CreateCategoryUseCase {
  constructor(private entriesRepository: ICategoriesRepository) {}
  async execute({ name }: CreateCategoryUseCaseRequest) {
    return await this.entriesRepository.createCategory({
      name
    });
  }
}
