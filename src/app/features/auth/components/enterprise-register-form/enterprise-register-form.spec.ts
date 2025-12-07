import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseRegisterForm } from './enterprise-register-form';

describe('EnterpriseRegisterForm', () => {
  let component: EnterpriseRegisterForm;
  let fixture: ComponentFixture<EnterpriseRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterpriseRegisterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
