import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { QuestionnaireModel } from 'src/app/models/questionnaire.model';
import { TestingConstants } from '../constants/testing-constants';
import { ProductModel } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private questionnaireSubject = new Subject<QuestionnaireModel>();

  constructor() { }

  public getQuestionnaireDataObservable(): Observable<QuestionnaireModel> {
    return this.questionnaireSubject.asObservable();
  }

  public loadFormData(): void {
    this.questionnaireSubject.next(TestingConstants.MockQuestionnaire);
  }

  public loadProducts(): Observable<ProductModel[]> {
    const products = TestingConstants.MockProducts;

    return of(products);
  }
}
