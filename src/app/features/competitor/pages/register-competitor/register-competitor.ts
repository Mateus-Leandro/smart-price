import { Component, inject, signal } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { CompetitorForm } from '../../components/competitor-form/competitor-form';
import { Button } from 'src/app/shared/components/button/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CompetitorService } from '../../services/competitor.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ICompetitorBrancheView } from 'src/app/features/competitor-branche/models/competitor-branche-view.model';
import { ICompetitorBrancheUpsert } from 'src/app/features/competitor-branche/models/competitor-branche-upsert.model';
import { CompetitorBrancheService } from 'src/app/features/competitor-branche/services/competitor-branche.service';

@Component({
  selector: 'app-register-competitor',
  imports: [
    Spinner,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    CompetitorForm,
    MatCardActions,
    Button,
    FlexLayoutModule,
  ],
  templateUrl: './register-competitor.html',
  styleUrl: './register-competitor.scss',
})
export class RegisterCompetitor {
  loading = inject(LoadingService).loading;
  selectedBranches = signal<ICompetitorBrancheView[]>([]);
  constructor(
    private router: Router,
    private competitorService: CompetitorService,
    private competitorBrancheService: CompetitorBrancheService,
  ) {}

  createOrUpdateCompetitors(competitorForm: FormGroup) {
    if (competitorForm.invalid) {
      competitorForm.markAllAsTouched();
      return;
    }

    const competitorId: number | null = competitorForm?.value?.id;
    const competitorName: string = competitorForm?.value?.name;
    const selectedBranchedId = this.selectedBranches().map((branche) => branche.id);
    if (competitorId) {
      this.competitorService
        .updateCompetitor({
          id: competitorId,
          name: competitorName,
        })
        .subscribe({
          next: () => {
            const competitorBrancheUpsert: ICompetitorBrancheUpsert = {
              competitorId: competitorId,
              brancheIds: selectedBranchedId,
            };
            this.upsertCompetitorBranches(competitorBrancheUpsert);
            this.returnToCompetitors();
          },
          error: (err) => {
            throw new Error(err);
          },
        });
    } else {
      this.competitorService.createCompetitor(competitorName).subscribe({
        next: (competitor) => {
          if (competitor) {
            const competitorBrancheUpsert: ICompetitorBrancheUpsert = {
              competitorId: competitor.id,
              brancheIds: selectedBranchedId,
            };
            this.upsertCompetitorBranches(competitorBrancheUpsert);
          }
          this.returnToCompetitors();
        },
        error: (err) => {
          throw new Error(err);
        },
      });
    }
  }

  upsertCompetitorBranches(competitoBrancheUpsert: ICompetitorBrancheUpsert) {
    this.competitorBrancheService.upsertCompetitorBranches(competitoBrancheUpsert);
  }

  returnToCompetitors() {
    this.router.navigate(['/competitors']);
  }
}
