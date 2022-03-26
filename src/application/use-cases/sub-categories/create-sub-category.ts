import { ICategoriesRepository } from '../../repositories/CategoriesRepository';

type CreateCategoryUseCaseRequest = {
  categoryId: number;
  name: string;
};

export class CreateCategoryUseCase {
  constructor(private entriesRepository: ICategoriesRepository) {}
  async execute({ categoryId, name }: CreateCategoryUseCaseRequest) {
    return await this.entriesRepository.createCategory({
      categoryId,
      name
    });
  }
}
