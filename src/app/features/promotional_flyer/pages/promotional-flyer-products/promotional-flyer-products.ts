import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromotionalFlyerService } from '../../services/promotional-flyer.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { PromotionalFlyerProductTable } from '../../components/promotional-flyer-product-table/promotional-flyer-product-table';

@Component({
  selector: 'app-promotional-flyer-products',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, PromotionalFlyerProductTable],
  templateUrl: './promotional-flyer-products.html',
  styleUrl: './promotional-flyer-products.scss',
})
export class PromotionalFlyerProducts {
  loading = false;
  dataSource = new MatTableDataSource<PromotionalFlyerProducts>([]);
  id: number = 0;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = Number(this?.route?.snapshot?.paramMap?.get('id'));
  }
}
