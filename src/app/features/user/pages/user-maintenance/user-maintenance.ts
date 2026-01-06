import { Component } from '@angular/core';
import { MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { UserMaintenanceTable } from '../../components/user-maintenance-table/user-maintenance-table';

@Component({
  selector: 'app-user-maintenance',
  imports: [MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, UserMaintenanceTable],
  templateUrl: './user-maintenance.html',
  styleUrl: './user-maintenance.scss',
})
export class UserMaintenance {}
