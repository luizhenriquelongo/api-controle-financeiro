import { IEntriesRepository } from '../../repositories/EntriesRepository';

export class GetAllEntriesUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute() {
    const entries = await this.entriesRepository.getAllEntries();

    return entries;
  }
}
