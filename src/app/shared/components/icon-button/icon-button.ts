import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatIconModule],
  templateUrl: './icon-button.html',
})
export class IconButton {
  @Input() icon: string = '';
  @Input() iconColor: string = 'var(--font-secondary)';
  @Input() height: string = '36px';
  @Input() width: string = '36px';
  @Input() disabled?: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
}
