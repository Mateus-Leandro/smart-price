import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { CompetitorRepository } from 'src/app/core/repositories/competitor.repository';
import { IUpdateCompetitor } from '../models/update-competitor.model';
import { ICompetitor } from 'src/app/core/models/competitor';

@Injectable({
  providedIn: 'root',
})
export class CompetitorService {
  constructor(private repository: CompetitorRepository) {}

  createCompetitor(competitorName: string) {
    return this.repository.createCompetitor(competitorName);
  }

  updateCompetitor(updateCompetitor: IUpdateCompetitor) {
    return this.repository.updateCompetitor(updateCompetitor);
  }

  loadCompetitors(paginator: IDefaultPaginatorDataSource<ICompetitor>, search?: string) {
    return this.repository.loadCompetitors(paginator, search);
  }

  getCompetitorInfoById(competitorId: number) {
    return this.repository.getCompetitorInfoById(competitorId);
  }
}
