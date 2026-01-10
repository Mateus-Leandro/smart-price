import { Injectable } from '@angular/core';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { CompetitorRepository } from 'src/app/core/repositories/competitor.repository';
import { ICompetitor } from '../models/competitor.model';

@Injectable({
  providedIn: 'root',
})
export class CompetitorService {
  constructor(private repository: CompetitorRepository) {}

  createCompetitor(competitorName: string) {
    return this.repository.createCompetitor(competitorName);
  }

  loadCompetitors(paginator: IDefaultPaginatorDataSource<ICompetitor>, search?: string) {
    return this.repository.loadCompetitors(paginator, search);
  }
}
