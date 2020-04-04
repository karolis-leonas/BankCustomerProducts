import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { QuestionnaireModel } from '../../models/questionnaire.model';
import { ProductModel } from '../../models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-window',
  templateUrl: './dynamic-window.component.html',
  styleUrls: ['./dynamic-window.component.css']
})
export class DynamicWindowComponent implements OnInit, OnDestroy {
  private questionnaireDataSubscription: Subscription;
  private formChangesSubscription: Subscription;
  public questionnaire: QuestionnaireModel;
  public isFormLoaded = false;
  public clientProducts: ProductModel[] = null;

  public profileForm: FormGroup = null;

  constructor(
    private dataService: DataService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.questionnaireDataSubscription = this.dataService.getQuestionnaireDataObservable().subscribe(
      (questionnaire: QuestionnaireModel) => {
        this.questionnaire = questionnaire;
      },
      (error) => {
        console.error(error);
      }
    );

    this.profileForm = this.formBuilder.group({
      ageId: new FormControl('', Validators.required),
      isStudentId: new FormControl('', Validators.required),
      incomeId: new FormControl('', Validators.required)
    });

    this.formChangesSubscription = this.profileForm.valueChanges.subscribe(formValues => {
      const isFormValid = this.profileForm.valid;
      const isAgeIdPresentAndNumber = formValues.ageId !== null && formValues.ageId !== '' && !isNaN(formValues.ageId);
      const isStudentStatusIdPresentAndNumber =
        formValues.isStudentId !== null && formValues.isStudentId !== '' && !isNaN(formValues.isStudentId);
      const isIncomeIdPresentAndNumber = formValues.incomeId !== null && formValues.incomeId !== '' && !isNaN(formValues.incomeId);

      if (isFormValid && isAgeIdPresentAndNumber && isStudentStatusIdPresentAndNumber && isIncomeIdPresentAndNumber) {
        const ageIdNumber = +formValues.ageId;
        const isStudentIdNumber = +formValues.isStudentId;
        const incomeIdNumber = +formValues.incomeId;

        this.productsService.getProducts(ageIdNumber, isStudentIdNumber, incomeIdNumber).subscribe(
          (products: ProductModel[]) => {
            this.clientProducts = products;
          }
        );
      }
    });

    this.dataService.loadFormData();
    this.isFormLoaded = true;
  }

  ngOnDestroy() {
    if (this.questionnaireDataSubscription) {
      this.questionnaireDataSubscription.unsubscribe();
    }

    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }
}
