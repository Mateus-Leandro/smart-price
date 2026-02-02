import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Button } from '../button/button';
import { FlexLayoutModule } from '@angular/flex-layout';

export interface DialogData {
  titleText?: string;
  messageText: string;
  cancelText?: string;
  confirmationText?: string;
  confirmationColor?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, Button, FlexLayoutModule],
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.titleText ??= 'Atenção';
    this.data.cancelText ??= 'Cancelar';
    this.data.confirmationText ??= 'Confirmar';
    this.data.confirmationColor ??= 'var(--cancel-color)';
  }
}
