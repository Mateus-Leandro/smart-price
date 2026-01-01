import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';

@Component({
  selector: 'app-tool-bar',
  imports: [MatToolbarModule, MatIconModule, IconButton],
  templateUrl: './tool-bar.html',
  styleUrl: '../../../global/styles/_toolbar.scss',
})
export class ToolBar {
  constructor() {}
  @Output() menuClick = new EventEmitter<void>();
}
