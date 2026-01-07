import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  imports: [MatIconModule, MatTooltipModule, MatIcon, MatButtonModule],
  templateUrl: './icon-button.html',
})
export class IconButton {
  @Input() icon: string = '';
  @Input() iconColor: string = 'var(--font-secondary)';
  @Input() height: string = '36px';
  @Input() width: string = '36px';
  @Input() disabled?: boolean = false;
  @Input() tooltipText: string = '';
  @Input() backgroundColor: string = 'var(--no-background-color)';
}
