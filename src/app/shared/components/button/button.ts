import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIcon, CommonModule, MatProgressSpinnerModule, Spinner],
  templateUrl: './button.html',
  styleUrl: '../../../global/styles/_buttons.scss',
})
export class Button {
  @Input() text: string = 'Botão';
  @Input() icon: string = '';
  @Input() bgColor: string = '#000';
  @Input() textColor: string = 'white';
  @Input() height: string = '40px';
  @Input() width: string = 'auto';
  @Input() fontSize: string = '16px';
  @Input() padding: string = '0 24px';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() spinnerDiameter = 70;
}
