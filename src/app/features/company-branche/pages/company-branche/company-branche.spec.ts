import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBranche } from './company-branche';

describe('CompanyBranche', () => {
  let component: CompanyBranche;
  let fixture: ComponentFixture<CompanyBranche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBranche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBranche);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
