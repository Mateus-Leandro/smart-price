import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterForm } from './user-register-form';

describe('UserRegisterForm', () => {
  let component: UserRegisterForm;
  let fixture: ComponentFixture<UserRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegisterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
