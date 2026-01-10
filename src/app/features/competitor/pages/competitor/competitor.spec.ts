import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Competitor } from './competitor';

describe('Competitor', () => {
  let component: Competitor;
  let fixture: ComponentFixture<Competitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Competitor],
    }).compileComponents();

    fixture = TestBed.createComponent(Competitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
