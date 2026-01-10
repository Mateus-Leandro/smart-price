import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { CompetitorTable } from '../../components/competitor-table/competitor-table';

@Component({
  selector: 'app-competitor',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, CompetitorTable],
  templateUrl: './competitor.html',
  styleUrl: './competitor.scss',
})
export class Competitor {}
