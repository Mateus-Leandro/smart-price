import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-btn-report',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './btn-report.html',
  styleUrl: './btn-report.scss',
})
export class BtnReport {
  @Input() tooltipText: string = 'Relatório';
  @Input() disabled: boolean = false;
  @Output() reportClick = new EventEmitter<void>();

  emitClick() {
    this.reportClick.emit();
  }
}
