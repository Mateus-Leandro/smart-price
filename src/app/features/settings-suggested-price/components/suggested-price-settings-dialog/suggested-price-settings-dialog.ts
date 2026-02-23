import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { NgxMaskDirective } from 'ngx-mask';

import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SuggestedPriceSettingService } from '../../services/suggested-price-setting.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ISuggestedPriceSettingUpsert } from 'src/app/core/models/suggested-price-setting.model';

import { Button } from 'src/app/shared/components/button/button';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog';
import { CompanySettingsService } from 'src/app/features/company-settings/services/company-settings.service';

type FormState = 'view' | 'create' | 'edit';

@Component({
  selector: 'app-settings-suggested-price-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDivider,
    NgxMaskDirective,
    Button,
    Spinner,
    IconButton,
  ],
  templateUrl: './suggested-price-settings-dialog.html',
  styleUrls: ['../../../../global/styles/_tables.scss', './suggested-price-settings-dialog.scss'],
})
export class SuggestedPriceSettingsDialog implements OnInit {
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private suggestedPriceSettingService: SuggestedPriceSettingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private companySettings: CompanySettingsService,
  ) {}

  dialogRef = inject(MatDialogRef<SuggestedPriceSettingsDialog>);
  loading = inject(LoadingService).loading;
  companyId = 0;
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = ['margin_min', 'margin_max', 'discount_percent', 'actions'];

  currentState = signal<FormState>('view');
  editingSettingId = signal<string | null>(null);

  increasePricePercentControl = new FormControl('', [Validators.maxLength(3), Validators.max(100)]);
  ruleFormGroup!: FormGroup;

  ngOnInit(): void {
    this.buildRuleForm();
    this.loadUserData();
  }

  buildRuleForm(): void {
    this.ruleFormGroup = this.fb.group({
      marginMin: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(7)],
      ],
      marginMax: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
      discountPercent: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
    });
  }

  loadUserData(): void {
    this.authService.getCompanyIdFromLoggedUser().subscribe({
      next: (companyId) => {
        this.companyId = companyId;
        this.loadSuggestedPriceSettings();
        this.loadCompanySettings();
      },
      error: (err) =>
        this.notificationService.showError(`Erro ao obter empresa: ${err.message || err}`),
    });
  }

  loadSuggestedPriceSettings(): void {
    this.suggestedPriceSettingService.loadSuggestedPriceSettings(this.companyId).subscribe({
      next: (response) => (this.dataSource.data = response),
      error: (err) =>
        this.notificationService.showError(`Erro ao carregar regras: ${err.message || err}`),
    });
  }

  loadCompanySettings() {
    this.companySettings.loadCompanySettings(this.companyId).subscribe({
      next: (companySettings) => {
        if (companySettings) {
          this.increasePricePercentControl.setValue(
            companySettings.data.increasePricePercent?.toString(),
            {
              emitEvent: false,
            },
          );
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao carregar configurações da empresa: ${err?.message || err}`,
        );
      },
    });
  }

  saveIncreasePricePercent() {
    if (this.increasePricePercent.invalid || this.increasePricePercent.value === null) return;

    const value = this.increasePricePercent.value;
    this.companySettings
      .saveCompanySettings({
        companyId: this.companyId,
        increasePricePercent: value,
      })
      .subscribe({
        error: (err) => {
          this.notificationService.showError(
            `Erro ao salvar percentual de acréscimo: ${err.message || err}`,
          );
        },
      });
  }

  setCreateMode(): void {
    this.buildRuleForm();
    this.editingSettingId.set(null);
    this.currentState.set('create');
  }

  setEditMode(element: any): void {
    this.ruleFormGroup.patchValue({
      marginMin: element.marginMin?.toString(),
      marginMax: element.marginMax?.toString(),
      discountPercent: element.discountPercent?.toString(),
    });

    this.editingSettingId.set(element.id);
    this.currentState.set('edit');

    this.cdr.detectChanges();
  }

  resetState(): void {
    this.buildRuleForm();
    this.editingSettingId.set(null);
    this.currentState.set('view');
  }

  cancel(): void {
    if (this.currentState() !== 'view') {
      this.resetState();
    } else {
      this.dialogRef.close();
    }
  }

  submitRule(): void {
    if (this.ruleFormGroup.invalid) return;

    const setting: ISuggestedPriceSettingUpsert = {
      id: this.editingSettingId() ?? undefined,
      companyId: this.companyId,
      marginMin: this.marginMin.value,
      marginMax: this.marginMax.value,
      discountPercent: this.discountPercent.value,
    };

    this.suggestedPriceSettingService.upsertSuggestedPriceSettings(setting).subscribe({
      next: () => {
        this.notificationService.showSuccess('Regra salva com sucesso.');
        this.resetState();
        this.loadSuggestedPriceSettings();
      },
      error: (err) =>
        this.notificationService.showError(`Erro ao salvar regra: ${err.message || err}`),
    });
  }

  deleteRule(id: string): void {
    this.dialog
      .open(ConfirmationDialog, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: {
          titleText: 'Excluir Configuração',
          messageText: 'Tem certeza que deseja apagar os dados? Esta ação é irreversível.',
          confirmationText: 'Excluir configuração',
          cancelText: 'Não',
        },
      })
      .afterClosed()
      .subscribe((confirmation) => {
        if (confirmation) {
          this.suggestedPriceSettingService.deleteSuggestedPriceSettings(id).subscribe({
            next: () => {
              this.notificationService.showSuccess('Regra removida com sucesso');
              this.loadSuggestedPriceSettings();
              if (this.editingSettingId() === id) this.resetState(); // Reseta se estiver editando o que foi apagado
            },
            error: (err) =>
              this.notificationService.showError(`Erro ao remover regra: ${err.message || err}`),
          });
        }
      });
  }

  get isViewing() {
    return this.currentState() === 'view';
  }
  get marginMin() {
    return this.ruleFormGroup.get('marginMin') as FormControl;
  }
  get marginMax() {
    return this.ruleFormGroup.get('marginMax') as FormControl;
  }
  get discountPercent() {
    return this.ruleFormGroup.get('discountPercent') as FormControl;
  }

  get increasePricePercent() {
    return this.increasePricePercentControl as FormControl;
  }
}
