/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataService } from './data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestingConstants } from '../test/constants/testing-constants';
import { throwError } from 'rxjs';

describe('DataService', () => {
  let httpTestingController: HttpTestingController;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    dataService = TestBed.get(DataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('DataService: should create an instance', () => {
    expect(dataService).toBeTruthy();
  });

  it('DataService: should load questionnaire (fake backend mock)', () => {
    sessionStorage.removeItem('questionnaire');
    dataService.getQuestionnaireDataObservable().subscribe(questionnaire => {
      expect(questionnaire).not.toBe(null);
      expect(questionnaire.ages.length).toBe(3);
      expect(questionnaire.ages[1].name).toBe('18-64');
      expect(questionnaire.studentStatus.length).toBe(2);
      expect(questionnaire.studentStatus[0].name).toBe('No');
      expect(questionnaire.incomes.length).toBe(4);
      expect(questionnaire.incomes[0].name).toBe('0');
    });

    dataService.loadFormData();

    const req = httpTestingController.expectOne(
      '../../assets/formInitialData.json'
    );

    req.flush(TestingConstants.MockQuestionnaire);
  });

  it('DataService: should load questionnaire (mock sessionStorage loading)', () => {
    sessionStorage.setItem(
      'questionnaire',
      JSON.stringify(TestingConstants.MockQuestionnaire)
    );

    dataService.getQuestionnaireDataObservable().subscribe(questionnaire => {
      expect(questionnaire).not.toBe(null);
      expect(questionnaire.ages.length).toBe(3);
      expect(questionnaire.ages[2].name).toBe('65+');
      expect(questionnaire.studentStatus.length).toBe(2);
      expect(questionnaire.studentStatus[1].name).toBe('Yes');
      expect(questionnaire.incomes.length).toBe(4);
      expect(questionnaire.incomes[1].name).toBe('1-12000');
    });

    dataService.loadFormData();
  });

  it('DataService: should load questionnaire (mock frontend caching)', () => {
    dataService.setQuestionnaire(TestingConstants.MockQuestionnaire);

    dataService.getQuestionnaireDataObservable().subscribe(questionnaire => {
      expect(questionnaire).not.toBe(null);
      expect(questionnaire.ages.length).toBe(3);
      expect(questionnaire.ages[0].name).toBe('0-17');
      expect(questionnaire.studentStatus.length).toBe(2);
      expect(questionnaire.studentStatus[1].name).toBe('Yes');
      expect(questionnaire.incomes.length).toBe(4);
      expect(questionnaire.incomes[2].name).toBe('12001-40000');
    });

    dataService.loadFormData();
  });

  it('DataService: should load questionnaire (mock frontend caching with empty answer data)', () => {
    sessionStorage.setItem(
      'questionnaire',
      JSON.stringify(TestingConstants.MockEmptyQuestionnaire)
    );

    dataService.getQuestionnaireDataObservable().subscribe(questionnaire => {
      expect(questionnaire).not.toBe(null);
      expect(questionnaire.ages.length).toBe(0);
      expect(questionnaire.studentStatus.length).toBe(0);
      expect(questionnaire.incomes.length).toBe(0);
    });

    dataService.loadFormData();
  });

  it('DataService: should throw error when loading questionnaire (fake error throw', () => {
    sessionStorage.removeItem('questionnaire');
    spyOn<any>(dataService, 'loadInitialQuestionnaireData').and.returnValue(throwError('Error'));

    dataService.loadFormData();
    expect(dataService['loadInitialQuestionnaireData']).toHaveBeenCalledTimes(1);
  });

  it('DataService: should load product data (fake backend mock)', () => {
    sessionStorage.removeItem('products');

    dataService.loadProducts().subscribe(products => {
      expect(products).not.toBe(null);
      expect(products.length).toBe(8);
    });

    const req = httpTestingController.expectOne(
      '../../assets/products.json'
    );

    req.flush(TestingConstants.MockProducts);
  });

  it('DataService: should load product data (mock sessionStorage loading)', () => {
    sessionStorage.setItem(
      'products',
      JSON.stringify(TestingConstants.MockProducts)
    );

    dataService.loadProducts().subscribe(products => {
      expect(products).not.toBe(null);
      expect(products.length).toBe(8);
    });
  });

  it('DataService: should load product data (mock frontend caching)', () => {
    dataService.setProducts(TestingConstants.MockProducts);

    dataService.loadProducts().subscribe(products => {
      expect(products).not.toBe(null);
      expect(products.length).toBe(8);
    });
  });
});
