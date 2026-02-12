import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { MatInputModule } from '@angular/material/input';
import { LoadingService } from 'src/app/core/services/loading.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SupplierDeliverySelect } from '../supplier-delivery-select/supplier-delivery-select';
import { SupplierDeliveryTypeEnum } from '../../../../core/enums/supplier.enum';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { IUserPermission } from 'src/app/core/models/user-permission.model';

@Component({
  selector: 'app-supplier-form',
  imports: [
    Spinner,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SupplierDeliverySelect,
    MatIconModule,
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm {
  @Output() submitForm = new EventEmitter<FormGroup>();
  loading = inject(LoadingService).loading;
  supplierFormGroup: FormGroup;
  supplierId: number | null = null;
  userPermissions: IUserPermission | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private userPermissionService: UserPermissionService,
  ) {
    this.supplierFormGroup = this.fb.group({
      id: [''],
      name: [''],
      supplierDeliveryType: [SupplierDeliveryTypeEnum.PORTA],
    });
  }

  ngOnInit() {
    const routerId = Number(this?.route?.snapshot?.paramMap?.get('id'));

    if (routerId) {
      this.authService.getUser().subscribe({
        next: (user) => {
          this.userPermissionService.getPermissions(user.id).subscribe({
            next: (permissions) => {
              this.userPermissions = permissions;
            },
            error: (err) => {
              this.notificationService.showError(
                `Erro ao buscar permissões do usuário: ${err.message || err}`,
              );
            },
          });
        },
        error: (err) => {
          this.notificationService.showError(`Erro ao buscar usuário: ${err.message || err}`);
        },
      });

      this.supplierService.getSupplierInfoById(routerId).subscribe({
        next: (supplier) => {
          if (!supplier) {
            this.handleNotFoundError();
          }

          this.supplierId = supplier.id;
          this.supplierFormGroup.patchValue({
            id: supplier.id,
            name: supplier.name,
            supplierDeliveryType: supplier.deliveryType,
          });

          this.supplierFormGroup.get('id')?.disable();
          this.supplierFormGroup.get('name')?.disable();
        },
        error: (err) => {
          this.notificationService.showError(
            `Erro ao carregar informarções do fornecedor: ${err.message || err}`,
          );
          this.handleNotFoundError();
        },
      });
    }
  }

  get name() {
    return this.supplierFormGroup.get('name')!;
  }

  get supplierDeliveryType() {
    return this.supplierFormGroup.get('supplierDeliveryType');
  }

  private handleNotFoundError() {
    this.router.navigate(['/suppliers']);
  }
}
