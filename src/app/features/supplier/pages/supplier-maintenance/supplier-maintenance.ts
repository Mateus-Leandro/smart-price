import { Component, inject } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatCardModule } from '@angular/material/card';
import { SupplierForm } from '../../components/supplier-form/supplier-form';
import { Button } from 'src/app/shared/components/button/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Route, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-supplier-maintenance',
  imports: [Spinner, MatCardModule, SupplierForm, Button, FlexLayoutModule],
  templateUrl: './supplier-maintenance.html',
  styleUrl: './supplier-maintenance.scss',
})
export class SupplierMaintenance {
  loading = inject(LoadingService).loading;
  constructor(private router: Router) {}

  saveSupplier(supplierFormGroup: FormGroup) {
    if (supplierFormGroup.invalid) {
      supplierFormGroup.markAllAsTouched();
      return;
    }

    this.returnToSuppliers();

    console.log(supplierFormGroup.get('supplierDeliveryType')?.value);
  }

  returnToSuppliers() {
    this.router.navigate(['/suppliers']);
  }
}
