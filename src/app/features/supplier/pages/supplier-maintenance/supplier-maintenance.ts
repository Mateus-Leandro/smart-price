import { Component, inject } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatCardModule } from '@angular/material/card';
import { SupplierForm } from '../../components/supplier-form/supplier-form';
import { Button } from 'src/app/shared/components/button/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SupplierService } from '../../services/supplier.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IUpdateSupplier } from 'src/app/core/models/supplier.model';

@Component({
  selector: 'app-supplier-maintenance',
  imports: [Spinner, MatCardModule, SupplierForm, Button, FlexLayoutModule],
  templateUrl: './supplier-maintenance.html',
  styleUrl: './supplier-maintenance.scss',
})
export class SupplierMaintenance {
  loading = inject(LoadingService).loading;
  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
  ) {}

  saveSupplier(supplierFormGroup: FormGroup) {
    console.log(supplierFormGroup.get('supplierDeliveryType')?.value);
    const updateSupplier: IUpdateSupplier = {
      deliveryType: supplierFormGroup.get('supplierDeliveryType')?.value,
      supplierId: supplierFormGroup.getRawValue().id,
    };
    this.supplierService.updateSupplier(updateSupplier).subscribe({
      next: () => {
        this.notificationService.showSuccess('Fornecedor salvo com sucesso!');
      },
      error: (err) => {
        this.notificationService.showError(`Erro ao atualizar fornecedor: ${err.message || err}`);
      },
    });

    this.returnToSuppliers();
  }

  returnToSuppliers() {
    this.router.navigate(['/suppliers']);
  }
}
