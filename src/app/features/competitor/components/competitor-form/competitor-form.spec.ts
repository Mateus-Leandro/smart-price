import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorForm } from './competitor-form';

describe('CompetitorForm', () => {
  let component: CompetitorForm;
  let fixture: ComponentFixture<CompetitorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
