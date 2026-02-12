import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match.validator';
import { UserService } from '../../services/user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MatDivider } from '@angular/material/divider';
import { Checkbox } from 'src/app/shared/components/checkbox/checkbox';
import { UserPermissionService } from 'src/app/features/user-permission/user-permission.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPasswordChangeDialog } from '../user-password-change-dialog/user-password-change-dialog';
import { ForgotPasswordDialog } from 'src/app/features/auth/components/forgot-password-dialog/forgot-password-dialog';
import { IconButton } from 'src/app/shared/components/icon-button/icon-button';
import { User } from '@supabase/supabase-js';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { IUserPermission } from 'src/app/core/models/user-permission.model';

@Component({
  selector: 'app-user-form',
  imports: [
    FlexLayoutModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatLabel,
    MatIconModule,
    Spinner,
    MatDivider,
    Checkbox,
    IconButton,
  ],
  templateUrl: './user-form.html',
})
export class UserForm {
  @Output() submitForm = new EventEmitter<FormGroup>();
  loading = inject(LoadingService).loading;
  userPermissions: IUserPermission | null = null;

  userFormGroup: FormGroup;
  userId: string | null = null;
  loggedUserInfo!: User;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private userPermissionService: UserPermissionService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.userFormGroup = this.fb.group(
      {
        id: [''],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
        pass: ['', [Validators.required, Validators.minLength(6)]],
        confirmationPass: ['', [Validators.required, Validators.minLength(6)]],

        isAdmin: this.fb.control<boolean>(false),
        allowEditPrices: this.fb.control<boolean>(false),
        allowEditCompetitorPrices: this.fb.control<boolean>(false),
        allowEditShippingValue: this.fb.control<boolean>(false),
        allowSendToErp: this.fb.control<boolean>(false),
        allowEditShippingType: this.fb.control<boolean>(false),
        allowEditProductMargin: this.fb.control<boolean>(false),
      },
      { validators: [PasswordMatchValidator.match('pass', 'confirmationPass')] },
    );

    this.userFormGroup.get('isAdmin')!.valueChanges.subscribe((isAdmin: boolean) => {
      this.checkAllPermissions(isAdmin);
    });

    this.pass.valueChanges.subscribe(() => {
      this.confirmationPass.updateValueAndValidity({ onlySelf: true });
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.userId = this?.route?.snapshot?.paramMap?.get('id');
    this.authService.getUser().subscribe({
      next: (user) => {
        this.loggedUserInfo = user;
        this.userPermissionService.getPermissions(user.id).subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;

            if (this.userId) {
              this.userService.getUserInfoByUserId(this.userId).subscribe({
                next: (user) => {
                  this.userPermissionService.getPermissions(this.userId!).subscribe({
                    next: (permissions) => {
                      this.userFormGroup.patchValue({
                        id: this.userId,
                        email: user.email,
                        name: user.name,

                        isAdmin: permissions?.isAdmin,
                        allowEditPrices: permissions?.allowEditPrices,
                        allowEditCompetitorPrices: permissions?.allowEditCompetitorPrices,
                        allowEditShippingValue: permissions?.allowEditShippingValue,
                        allowSendToErp: permissions?.allowSendToErp,
                        allowEditShippingType: permissions?.allowEditShippingType,
                        allowEditProductMargin: permissions?.allowEditProductMargin,
                      });

                      this.userFormGroup.get('pass')?.disable();
                      this.userFormGroup.get('confirmationPass')?.disable();

                      if (
                        this.loggedUserInfo.id !== this.userId &&
                        !this.userPermissions?.isAdmin
                      ) {
                        this.userFormGroup.get('email')?.disable();
                        this.userFormGroup.get('name')?.disable();
                      }
                    },
                    error: (err) => {
                      this.notificationService.showError(
                        `Erro ao carregar permissões do usuário: ${err.message || err}`,
                      );
                    },
                  });
                },
                error: (err) => {
                  this.notificationService.showError(
                    `Erro ao carregar informações do usuário: ${err.message || err}`,
                  );
                  this.handleNotFoundError();
                },
              });
            }
          },
          error: (err) => {
            this.notificationService.showError(
              `Erro ao carregar permissões do usuário logado: ${err.message || err}`,
            );
          },
        });
      },
    });
  }

  private handleNotFoundError() {
    this.router.navigate(['/users']);
  }

  onSubmit() {
    this.userFormGroup.markAllAsTouched();
    if (this.userFormGroup.invalid) return;

    this.submitForm.emit(this.userFormGroup);
  }

  get name() {
    return this.userFormGroup.get('name')!;
  }
  get email() {
    return this.userFormGroup.get('email')!;
  }
  get pass() {
    return this.userFormGroup.get('pass')!;
  }
  get confirmationPass() {
    return this.userFormGroup.get('confirmationPass')!;
  }

  private checkAllPermissions(isAdmin: boolean) {
    const permissions = [
      'allowEditCompetitorPrices',
      'allowEditPrices',
      'allowEditShippingValue',
      'allowSendToErp',
      'allowEditShippingType',
      'allowEditProductMargin',
    ];

    permissions.forEach((controlName) => {
      const control = this.userFormGroup.get(controlName);

      control?.setValue(isAdmin, { emitEvent: false });

      if (isAdmin) {
        control?.disable({ emitEvent: false });
      } else {
        control?.enable({ emitEvent: false });
      }
    });
  }

  openChangePassDialog() {
    this.dialog.open(UserPasswordChangeDialog, {
      minWidth: '600px',
      disableClose: false,
      autoFocus: true,
      data: this.userFormGroup.getRawValue()?.email,
    });
  }

  openForgoutPassDialog() {
    this.dialog.open(ForgotPasswordDialog, {
      minWidth: '600px',
      disableClose: false,
      autoFocus: true,
      data: this.userFormGroup.getRawValue()?.email,
    });
  }

  get canChangePassword(): boolean {
    const formId = this.userFormGroup?.getRawValue()?.id;
    return !!(this.loggedUserInfo && formId === this.loggedUserInfo.id);
  }
}
