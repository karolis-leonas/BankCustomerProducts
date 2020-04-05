/* tslint:disable:no-unused-variable */
import { inject } from '@angular/core/testing';

import { ProductsTableComponent } from './products-table.component';

describe('ProductsTableComponent', () => {
  it('ProductsTableComponent: should create an instance',
    inject([], () => {
        const productsTableComponent = new ProductsTableComponent();

        expect(productsTableComponent).toBeTruthy();
      }
    )
  );
});
