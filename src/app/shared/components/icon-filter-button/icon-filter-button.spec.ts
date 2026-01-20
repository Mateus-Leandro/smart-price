import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFilterButton } from './icon-filter-button';

describe('IconFilterButton', () => {
  let component: IconFilterButton;
  let fixture: ComponentFixture<IconFilterButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconFilterButton],
    }).compileComponents();

    fixture = TestBed.createComponent(IconFilterButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
