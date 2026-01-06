import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaintenanceTable } from './user-maintenance-table';

describe('UserMaintenanceTable', () => {
  let component: UserMaintenanceTable;
  let fixture: ComponentFixture<UserMaintenanceTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaintenanceTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMaintenanceTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
