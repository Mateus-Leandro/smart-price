import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { CompanyBrancheTable } from '../../components/company-branche-table/company-branche-table';

@Component({
  selector: 'app-company-branche',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    FlexLayoutModule,
    CompanyBrancheTable,
  ],
  templateUrl: './company-branche.html',
  styleUrl: './company-branche.scss',
})
export class CompanyBranche {}
