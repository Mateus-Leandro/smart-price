import { Component, EventEmitter, inject, model, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitorService } from '../../services/competitor.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormField, MatLabel } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ICompanyBranche } from 'src/app/core/models/company-branche.model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { InputBranches } from 'src/app/shared/components/input-branches/input-branches';
import { CompetitorBrancheService } from 'src/app/features/competitor-branche/services/competitor-branche.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { switchMap } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ICompetitorBrancheView } from 'src/app/core/models/competitor-branche.model';

@Component({
  selector: 'app-competitor-form',
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormField,
    MatLabel,
    CommonModule,
    MatInputModule,
    InputBranches,
    Spinner,
  ],
  templateUrl: './competitor-form.html',
  styleUrl: './competitor-form.scss',
})
export class CompetitorForm {
  @Output() submitForm = new EventEmitter<FormGroup>();
  loading = inject(LoadingService).loading;
  competitorFormGroup: FormGroup;
  competitorId: number | null = null;
  competitorBrancheList = model<ICompetitorBrancheView[]>([]);
  paginatorDataSource: IDefaultPaginatorDataSource<ICompanyBranche> = {
    pageIndex: 0,
    pageSize: 99,
    records: { data: [], count: 0 },
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private competitorService: CompetitorService,
    private competitorBrancheService: CompetitorBrancheService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.competitorFormGroup = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
    });
  }

  ngOnInit() {
    const routerId = Number(this?.route?.snapshot?.paramMap?.get('id'));

    if (routerId) {
      this.competitorService
        .getCompetitorInfoById(routerId)
        .pipe(
          switchMap((competitor) => {
            if (!competitor) {
              this.handleNotFoundError();
            }

            this.competitorId = competitor.id;
            this.competitorFormGroup.patchValue({
              id: competitor.id,
              name: competitor.name,
            });

            return this.competitorBrancheService.loadCompetitorBranches(competitor.id);
          }),
        )
        .subscribe({
          next: (branches) => {
            this.competitorBrancheList.set(branches);
          },
          error: (err) => {
            this.notificationService.showError(
              `Erro ao carregar informarções do concorrente: ${err.message || err}`,
            );
            this.handleNotFoundError();
          },
        });
    }
  }

  get name() {
    return this.competitorFormGroup.get('name')!;
  }

  private handleNotFoundError() {
    this.router.navigate(['/competitors']);
  }
}
