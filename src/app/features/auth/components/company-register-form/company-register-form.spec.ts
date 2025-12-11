import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegisterForm } from './company-register-form';

describe('CompanyRegisterForm', () => {
  let component: CompanyRegisterForm;
  let fixture: ComponentFixture<CompanyRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
