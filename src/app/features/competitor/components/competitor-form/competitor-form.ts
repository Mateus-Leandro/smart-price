import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { ICompetitorBrancheView } from 'src/app/features/competitor-branche/models/competitor-branche-view.model';
import { Spinner } from 'src/app/shared/components/spinner/spinner';

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
  competitorBrancheList = signal<ICompetitorBrancheView[]>([]);
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
  ) {
    this.competitorFormGroup = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
    });
  }

  ngOnInit() {
    const routerId = this?.route?.snapshot?.paramMap?.get('id');
    if (routerId) {
      this.competitorId = Number(routerId);
    }

    if (this.competitorId) {
      this.competitorService.getCompetitorInfoById(this.competitorId).subscribe((user) => {
        this.competitorFormGroup.patchValue({
          id: user.id,
          name: user.name,
        });
      });

      this.competitorBrancheService.loadCompetitorBranches(this.competitorId).subscribe({
        next: (response) => {
          this.competitorBrancheList.set(response);
        },
        error: (err) => {
          console.log('Erro ao carregar lojas vinculadas ao concorrente', err);
        },
      });
    }
  }

  get name() {
    return this.competitorFormGroup.get('name')!;
  }
}
