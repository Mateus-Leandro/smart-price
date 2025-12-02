import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincingRecordsForm } from './princing-records-form';

describe('PrincingRecordsForm', () => {
  let component: PrincingRecordsForm;
  let fixture: ComponentFixture<PrincingRecordsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincingRecordsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincingRecordsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
