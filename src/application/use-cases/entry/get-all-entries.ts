import { IEntriesRepository } from '../../repositories/entries.repository';

export class GetAllEntriesUseCase {
  constructor(private entriesRepository: IEntriesRepository) {}
  async execute() {
    const entries = await this.entriesRepository.getAllEntries();

    return entries;
  }
}
