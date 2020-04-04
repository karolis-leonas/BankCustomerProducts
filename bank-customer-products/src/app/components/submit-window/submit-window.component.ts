import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionnaireModel } from 'src/app/models/questionnaire.model';
import { DataService } from 'src/app/services/data.service';
import { ProductsService } from 'src/app/services/products.service';
import { ProductModel } from 'src/app/models/product.model';

@Component({
  selector: 'app-submit-window',
  templateUrl: './submit-window.component.html',
  styleUrls: ['./submit-window.component.css']
})
export class SubmitWindowComponent implements OnInit, OnDestroy {
  private questionnaireDataSubscription: Subscription;
  public questionnaire: QuestionnaireModel;
  public clientProducts: ProductModel[] = null;

  constructor(
    private dataService: DataService,
    private productsService: ProductsService
  ) { }

  onSubmit(form) {
    const isFormValid = form.valid;
    const isAgeIdPresentAndNumber = form.value.ageId !== null && form.value.ageId !== '' && !isNaN(form.value.ageId);
    const isStudentStatusIdPresentAndNumber =
      form.value.isStudentId !== null && form.value.isStudentId !== '' && !isNaN(form.value.isStudentId);
    const isIncomeIdPresentAndNumber = form.value.incomeId !== null && form.value.incomeId !== '' && !isNaN(form.value.incomeId);

    if (isFormValid && isAgeIdPresentAndNumber && isStudentStatusIdPresentAndNumber && isIncomeIdPresentAndNumber) {
      const ageIdNumber = +form.value.ageId;
      const isStudentIdNumber = +form.value.isStudentId;
      const incomeIdNumber = +form.value.incomeId;

      this.productsService.getProducts(ageIdNumber, isStudentIdNumber, incomeIdNumber).subscribe(
        (products: ProductModel[]) => {
          this.clientProducts = products;
        }
      );
    }
  }

  ngOnInit() {
    this.questionnaireDataSubscription = this.dataService.getQuestionnaireDataObservable().subscribe(
      (questionnaire: QuestionnaireModel) => {
        this.questionnaire = questionnaire;
        console.log(this.questionnaire);
      },
      (error) => {
        console.error(error);
      }
    );

    this.dataService.loadFormData();
  }

  ngOnDestroy() {
    if (this.questionnaireDataSubscription) {
      this.questionnaireDataSubscription.unsubscribe();
    }
  }
}
