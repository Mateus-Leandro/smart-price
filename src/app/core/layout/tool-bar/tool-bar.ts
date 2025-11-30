import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-tool-bar',
  imports: [MatToolbarModule],
  templateUrl: './tool-bar.html',
  styleUrl: '../../../global/styles/_toolbar.scss',
})
export class ToolBar {}
