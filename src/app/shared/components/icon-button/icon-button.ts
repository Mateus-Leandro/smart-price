import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatIconModule],
  templateUrl: './icon-button.html',
  styleUrl: '../../../global/styles/_buttons.scss',
})
export class IconButton {
  @Input() icon: string = '';
}
