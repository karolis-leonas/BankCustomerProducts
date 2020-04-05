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

  public setQuestionnaire(mappedQuestionnaire: QuestionnaireModel): void {
    this.questionnaire = mappedQuestionnaire;
  }

  public setProducts(mappedProducts: ProductModel[]): void {
    this.products = mappedProducts;
  }

  public getQuestionnaireDataObservable(): Observable<QuestionnaireModel> {
    return this.questionnaireSubject.asObservable();
  }

  loadFormData(): void {
    if (this.questionnaire) {
      this.questionnaireSubject.next(this.questionnaire);
    } else {
      if (sessionStorage.getItem('questionnaire') != null) {
        const unmappedQuestionnaire = JSON.parse(
          sessionStorage.getItem('questionnaire')
        );
        const mappedQuestionnaire = this.mapQuestionnaireData(unmappedQuestionnaire);
        this.setQuestionnaire(mappedQuestionnaire);

        this.questionnaireSubject.next(this.questionnaire);
      } else {
        this.loadInitialQuestionnaireData().subscribe(
          mappedQuestionnaire => {
            this.setQuestionnaire(mappedQuestionnaire);
            this.questionnaireSubject.next(this.questionnaire);
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }

  private loadInitialQuestionnaireData(): Observable<QuestionnaireModel> {
    return this.httpClient.get('../../assets/formInitialData.json').pipe(
      map((unmappedQuestionnaire: any) => {
        const mappedQuestionnaire = this.mapQuestionnaireData(
          unmappedQuestionnaire
        );
        sessionStorage.setItem(
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
      if (sessionStorage.getItem('products') != null) {
        const unmappedProducts = JSON.parse(sessionStorage.getItem('products'));
        const mappedProducts = this.mapProductsData(unmappedProducts);
        this.setProducts(mappedProducts);

        return of(this.products);
      } else {
        return this.loadInitialProductsData().pipe(
          map((mappedProducts: ProductModel[]) => {
            this.setProducts(mappedProducts);

            return mappedProducts;
          })
        );
      }
    }
  }

  private loadInitialProductsData(): Observable<ProductModel[]> {
    return this.httpClient.get('../../assets/products.json').pipe(
      map((unmappedProducts: any) => {
        const mappedProducts = this.mapProductsData(unmappedProducts);
        sessionStorage.setItem('products', JSON.stringify(mappedProducts));

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
