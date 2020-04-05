/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, tick } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { MockDataService } from '../test/mock-services/mock-data.service';

describe('ProductsService', () => {
  let httpTestingController: HttpTestingController;
  let productsService: ProductsService;

  // Some assertions and equal checks did not work properly with arrays, therefore I had used manual array check
  const containsAll = (firstArray, secondArray) => secondArray.every(secondArrayItem => firstArray.includes(secondArrayItem))
  const sameMembers = (firstArray, secondArray) => containsAll(firstArray, secondArray) && containsAll(secondArray, firstArray);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        {provide: DataService, useClass: MockDataService}
      ],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    productsService = TestBed.get(ProductsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('ProductsService: should create an instance', () => {
    expect(productsService).toBeTruthy();
  });

  it('ProductsService: should find items according to certain request', () => {
    const products = productsService.getProducts(2, 0, 2);

    products.subscribe(result => {
      expect(result).not.toBe(null);
      expect(result).not.toEqual(null);

      expect(result.length === 4).toBeTruthy();
      expect(result[2].name === 'Senior Account').toBeTruthy();
      expect(result[1].id === 1).toBeTruthy();
      expect(result[3].requiredStudentStatus).toBeFalsy();

      expect(result[3].requiredAgeIds && result[3].requiredAgeIds.length > 0 &&
        sameMembers(result[3].requiredAgeIds, [1, 2])).toBeTruthy();

      expect(result[2].requiredIncomeIds && result[2].requiredIncomeIds.length > 0 &&
        sameMembers(result[2].requiredIncomeIds, [1, 2, 3])).toBeTruthy();
    });
  });

  it('ProductsService: should find no products if every id is not present in questionnaire', () => {
    const products = productsService.getProducts(5, 5, 5);

    products.subscribe(result => {
      expect(result.length === 0).toBeTruthy();
    });
  });
});
