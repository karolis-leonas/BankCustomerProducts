import { Component, OnInit, Input } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css']
})
export class ProductsTableComponent implements OnInit {

  @Input() products: ProductModel[] = null;

  constructor() { }

  ngOnInit() {
  }

}
