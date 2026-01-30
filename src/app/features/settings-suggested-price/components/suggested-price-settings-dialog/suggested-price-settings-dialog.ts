import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
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
import { NgxMaskDirective } from 'ngx-mask';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Button } from 'src/app/shared/components/button/button';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SuggestedPriceSettingService } from '../../services/suggested-price-setting.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ISuggestedPriceSettingUpsert } from 'src/app/core/models/suggested-price-setting.model';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { ConfirmationDialog } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-settings-suggested-price-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    Button,
    Spinner,
    NgxMaskDirective,
    MatTableModule,
    MatIconModule,
    IconButton,
  ],
  templateUrl: './suggested-price-settings-dialog.html',
  styleUrl: '../../../../global/styles/_tables.scss',
})
export class SuggestedPriceSettingsDialog {
  companyId = 0;
  suggestedPriceSettingsFormGroup!: FormGroup;
  loading = inject(LoadingService).loading;
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = ['margin_min', 'margin_max', 'discount_percent'];
  editingSettingId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SuggestedPriceSettingsDialog>,
    private notificationService: NotificationService,
    private suggestedPriceSettingService: SuggestedPriceSettingService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.buildFormGroup();
  }

  buildFormGroup() {
    this.suggestedPriceSettingsFormGroup = this.fb.group({
      marginMin: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(7)],
      ],
      marginMax: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
      discounPercent: [
        '',
        [Validators.required, Validators.maxLength(3), Validators.max(100), Validators.min(0)],
      ],
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  loadSuggestedPriceSettings() {
    this.suggestedPriceSettingService.loadSuggestedPriceSettings(this.companyId).subscribe({
      next: (response) => {
        this.dataSource.data = response;
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao carregar configurações: ${err.message || err}`);
      },
    });
  }

  reload() {
    this.authService.getCompanyIdFromLoggedUser().subscribe({
      next: (companyId) => {
        this.companyId = companyId;
        this.loadSuggestedPriceSettings();
      },
      error: (err) => {
        this.notificationService.showError(
          `Erro ao obter empresa do usuário: ${err.message || err}`,
        );
      },
    });
  }

  submit() {
    if (this.suggestedPriceSettingsFormGroup.invalid) return;

    const setting: ISuggestedPriceSettingUpsert = {
      id: this.editingSettingId() ?? undefined,
      companyId: this.companyId,
      marginMin: this.marginMin.value,
      marginMax: this.marginMax.value,
      discountPercent: this.discounPercent.value,
    };

    this.suggestedPriceSettingService.upsertSuggestedPriceSettings(setting).subscribe({
      next: () => {
        this.editingSettingId.set(null);
        this.buildFormGroup();
        this.reload();
        this.notificationService.showSuccess('Configuração gravada com sucesso.');
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao salvar configuração: ${err.message || err}`);
      },
    });
  }

  cancel() {
    if (this.editingSettingId()) {
      this.editingSettingId.set(null);
      this.buildFormGroup();
      return;
    }
    this.dialogRef.close();
  }

  editSetting(row: any) {
    this.editingSettingId.set(row.id);
    this.marginMin.setValue(row.marginMin);
    this.marginMax.setValue(row.marginMax);
    this.discounPercent.setValue(row.discountPercent);
  }

  deleteSuggestedPriceSettings() {
    if (!this.editingSettingId()) return;

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
          this.suggestedPriceSettingService
            .deleteSuggestedPriceSettings(this.editingSettingId()!)
            .subscribe({
              next: () => {
                this.reload();
                this.buildFormGroup();
                this.notificationService.showSuccess(`Configuração removido com sucesso`);
              },
              error: (err) => {
                this.notificationService.showError(
                  `Erro ao remover configuração: ${err.message || err}`,
                );
              },
            });
        }

        this.editingSettingId.set(null);
        this.buildFormGroup();
      });
  }

  get marginMin() {
    return this.suggestedPriceSettingsFormGroup.get('marginMin')! as FormControl;
  }

  get marginMax() {
    return this.suggestedPriceSettingsFormGroup.get('marginMax')! as FormControl;
  }

  get discounPercent() {
    return this.suggestedPriceSettingsFormGroup.get('discounPercent')! as FormControl;
  }
}
