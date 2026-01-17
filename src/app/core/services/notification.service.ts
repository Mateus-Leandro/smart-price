import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snackbar } from 'src/app/shared/components/snackbar/snackbar';

export type SnackbarColor = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private longDuration = 5000;
  private duration = 3500;

  show(message: string, color: SnackbarColor = 'info', duration: number = this.longDuration) {
    this.snackBar.openFromComponent(Snackbar, {
      data: {
        message,
      },
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${color}`],
    });
  }

  showError(message: string, duration = this.longDuration) {
    this.show(message, 'error', duration);
  }

  showSuccess(message: string, duration = this.duration) {
    this.show(message, 'success', duration);
  }

  showWarning(message: string, duration = this.longDuration) {
    this.show(message, 'warning', duration);
  }

  showInfo(message: string, duration = this.longDuration) {
    this.show(message, 'info', duration);
  }
}
