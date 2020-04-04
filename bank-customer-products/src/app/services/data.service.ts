import { Injectable } from '@angular/core';
import { Subject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, share } from 'rxjs/operators';
import { QuestionnaireModel } from '../models/questionnaire.model';
import { ProductModel } from '../models/product.model';
import { AnswerObjectModel } from '../models/answer-object.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private questionnaire: QuestionnaireModel = null;
  private questionnaireSubject = new Subject<QuestionnaireModel>();
  private products: ProductModel[] = [];

  constructor(private httpClient: HttpClient) {}

  public getQuestionnaireDataObservable(): Observable<QuestionnaireModel> {
    return this.questionnaireSubject.asObservable();
  }

  loadFormData(): void {
    if (localStorage.getItem('questionnaire') != null) {
      const unmappedQuestionnaire = JSON.parse(
        localStorage.getItem('questionnaire')
      );
      this.questionnaire = this.mapQuestionnaireData(unmappedQuestionnaire);

      this.questionnaireSubject.next(this.questionnaire);
    } else {
      this.loadInitialQuestionnaireData().subscribe(
        mappedQuestionnaire => {
          this.questionnaire = mappedQuestionnaire;

          this.questionnaireSubject.next(this.questionnaire);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  private loadInitialQuestionnaireData(): Observable<QuestionnaireModel> {
    return this.httpClient.get('../../assets/formInitialData.json').pipe(
      map((unmappedQuestionnaire: any) => {
        const mappedQuestionnaire = this.mapQuestionnaireData(
          unmappedQuestionnaire
        );
        localStorage.setItem(
          'questionnaire',
          JSON.stringify(mappedQuestionnaire)
        );

        return mappedQuestionnaire;
      })
    );
  }

  private mapQuestionnaireData(unmappedQuestionnaire: any): QuestionnaireModel {
    const mappedAges: AnswerObjectModel[] = this.mapAnswerObjects(
      unmappedQuestionnaire.ages
    );
    const mappedStudentStatus: AnswerObjectModel[] = this.mapAnswerObjects(
      unmappedQuestionnaire.studentStatus
    );
    const mappedIncomes: AnswerObjectModel[] = this.mapAnswerObjects(
      unmappedQuestionnaire.incomes
    );

    const mappedQuestionnaire: QuestionnaireModel = {
      ages: mappedAges,
      studentStatus: mappedStudentStatus,
      incomes: mappedIncomes
    };

    return mappedQuestionnaire;
  }

  private mapAnswerObjects(unmappedAnswerObjects): AnswerObjectModel[] {
    const mappedAnswerObjects: AnswerObjectModel[] = [];

    if (unmappedAnswerObjects && unmappedAnswerObjects.length > 0) {
      unmappedAnswerObjects.forEach(unmappedAnswerObject => {
        const mappedAnswerObject: AnswerObjectModel = {
          id: unmappedAnswerObject.id,
          name: unmappedAnswerObject.name
        };
        mappedAnswerObjects.push(mappedAnswerObject);
      });
    }

    return mappedAnswerObjects;
  }

  loadProducts(): Observable<ProductModel[]> {
    if (this.products && this.products.length > 0) {
      return of(this.products);
    } else {
      if (localStorage.getItem('products') != null) {
        const unmappedProducts = JSON.parse(localStorage.getItem('products'));
        this.products = this.mapProductsData(unmappedProducts);

        return of(this.products);
      } else {
        this.loadInitialProductsData().subscribe(
          mappedProducts => {
            this.products = mappedProducts;
            return of(this.products);
          },
          error => {
            return throwError(error);
          }
        );
      }
    }
  }

  private loadInitialProductsData(): Observable<ProductModel[]> {
    return this.httpClient.get('../../assets/products.json').pipe(
      map((unmappedProducts: any) => {
        const mappedProducts = this.mapProductsData(unmappedProducts);
        localStorage.setItem('products', JSON.stringify(mappedProducts));

        return mappedProducts;
      })
    );
  }

  private mapProductsData(unmappedProducts: any): Array<ProductModel> {
    const mappedProducts: ProductModel[] = [];

    unmappedProducts.forEach(product => {
      const mappedProduct: ProductModel = {
        id: product.id,
        name: product.name,
        requiredAgeIds: product.requiredAgeIds,
        requiredStudentStatus: product.requiredStudentStatus,
        requiredIncomeIds: product.requiredIncomeIds
      };

      mappedProducts.push(mappedProduct);
    });

    return mappedProducts;
  }
}
