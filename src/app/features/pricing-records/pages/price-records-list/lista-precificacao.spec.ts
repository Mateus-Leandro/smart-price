import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPrecificacao } from './price-records-list';

describe('ListaPrecificacao', () => {
  let component: ListaPrecificacao;
  let fixture: ComponentFixture<ListaPrecificacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPrecificacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPrecificacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
