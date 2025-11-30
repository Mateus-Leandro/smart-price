import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIcon, CommonModule],
  templateUrl: './button.html',
  styleUrl: '../../../global/styles/_buttons.scss',
})
export class Button {
  @Input() text: string = 'Botão';
  @Input() icon: string = '';
  @Input() bgColor: string = '#000';
  @Input() textColor: string = 'white';
}
