import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBranches } from './input-branches';

describe('InputBranches', () => {
  let component: InputBranches;
  let fixture: ComponentFixture<InputBranches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBranches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputBranches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
