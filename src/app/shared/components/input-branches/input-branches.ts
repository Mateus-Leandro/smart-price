import { Component, computed, model, OnInit, signal, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ICompanyBrancheView } from 'src/app/features/company-branche/models/company-branch-view.model';
import { CompanyBrancheService } from 'src/app/features/company-branche/services/company-branche.service';
import { IDefaultPaginatorDataSource } from 'src/app/core/models/query.model';
import { ICompetitorBrancheView } from 'src/app/features/competitor-branche/models/competitor-branche-view.model';
import { NotificationService } from 'src/app/core/services/notification.service';
type AllowedBrancheTypes = ICompanyBrancheView | ICompetitorBrancheView;

@Component({
  selector: 'app-input-branches',
  standalone: true,
  imports: [
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  templateUrl: './input-branches.html',
  styleUrl: './input-branches.scss',
})
export class InputBranches<T extends AllowedBrancheTypes> implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBrancheList = model<T[]>([]);
  allBrancheList = signal<T[]>([]);
  searchBrancheName = model('');

  paginatorDataSource: IDefaultPaginatorDataSource<T> = {
    pageIndex: 0,
    pageSize: 99,
    records: { count: 0, data: [] },
  };

  constructor(
    private companyBrancheService: CompanyBrancheService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.companyBrancheService
      .loadCompanyBranches(
        this.paginatorDataSource as IDefaultPaginatorDataSource<ICompanyBrancheView>,
      )
      .subscribe({
        next: (response) => this.allBrancheList.set(response.data as T[]),
        error: (err) => {
          this.notificationService.showError(`Erro ao buscar lojas: ${err.message || err}`);
        },
      });
  }

  removeBranche(brancheId: number) {
    this.selectedBrancheList.update((list) => list.filter((b) => b.id !== brancheId));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const branche = event.option.value as T;
    const currentList = this.selectedBrancheList();

    if (!currentList.some((b) => b.id === branche.id)) {
      this.selectedBrancheList.update((list) => [...list, branche]);
    }

    this.searchBrancheName.set('');

    // Abrir componente novamente ao selecionar loja
    // requestAnimationFrame(() => {
    //   this.autocompleteTrigger.openPanel();
    // });
  }

  filteredBranches = computed(() => {
    const filterValue = this.searchBrancheName().toLowerCase().trim();
    const allBranches = this.allBrancheList();
    const selectedIds = new Set(this.selectedBrancheList().map((b) => b.id));

    return allBranches.filter((branche) => {
      const matchesText = branche.name.toLowerCase().includes(filterValue);
      const notSelected = !selectedIds.has(branche.id);
      return matchesText && notSelected;
    });
  });
}
