import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private dataService: DataService) { }

  getProducts(ageId: number, isStudentId: number, incomeId: number): Observable<ProductModel[]> {
      return this.dataService.loadProducts().pipe(
        map((products: ProductModel[]) => {
          const visibleProducts: ProductModel[] = [];

          products.forEach((product: ProductModel) => {
            const matchesAgeRequirements = !product.requiredAgeIds || product.requiredAgeIds.length === 0
              || product.requiredAgeIds.some(id => id === ageId);
            const matchesStudentStatusRequirements = product.requiredStudentStatus === null
              || product.requiredStudentStatus === isStudentId;
            const matchesIncomeRequirements = !product.requiredIncomeIds || product.requiredIncomeIds.length === 0
              || product.requiredIncomeIds.some(id => id === incomeId);

            if (matchesAgeRequirements && matchesStudentStatusRequirements && matchesIncomeRequirements) {
              visibleProducts.push(product);
            }
          });

          return visibleProducts;
        })
      );
  }

}
