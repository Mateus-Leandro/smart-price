import { Injectable } from '@angular/core';
import { CompetitorBrancheRepository } from 'src/app/core/repositories/competitor-branche.repository';

@Injectable({
  providedIn: 'root',
})
export class CompetitorBrancheService {
  constructor(private repository: CompetitorBrancheRepository) {}

  loadCompetitorBranches(competitorId: number) {
    return this.repository.loadCompetitorBranches(competitorId);
  }

  upsertCompetitorBranches(competitorBrancheUpsert: any) {
    return this.repository.upsertCompetitorBranches(competitorBrancheUpsert);
  }
}
