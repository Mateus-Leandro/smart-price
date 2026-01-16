import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordChangeDialog } from './user-password-change-dialog';

describe('UserPasswordChangeDialog', () => {
  let component: UserPasswordChangeDialog;
  let fixture: ComponentFixture<UserPasswordChangeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPasswordChangeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPasswordChangeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
