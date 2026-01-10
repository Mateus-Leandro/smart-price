import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompetitor } from './register-competitor';

describe('RegisterCompetitor', () => {
  let component: RegisterCompetitor;
  let fixture: ComponentFixture<RegisterCompetitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCompetitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCompetitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
