/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule, } from '@angular/common/http/testing';
import { SubmitWindowComponent } from './submit-window.component';
import { FormsModule } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { DataService } from 'src/app/services/data.service';
import { MockDataService } from 'src/app/test/mock-services/mock-data.service';
import { throwError } from 'rxjs';

describe('SubmitWindowComponent', () => {
  let submitWindowComponent: SubmitWindowComponent;
  let submitWindowFixture: ComponentFixture<SubmitWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubmitWindowComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        {provide: ProductsService, useClass: ProductsService},
        {provide: DataService, useClass: MockDataService}
      ]
    });
  });

  beforeEach(() => {
    submitWindowFixture = TestBed.createComponent(SubmitWindowComponent);
    submitWindowComponent = submitWindowFixture.componentInstance;
    submitWindowFixture.detectChanges();
  });

  it('SubmitWindowComponent: should be created and ngOnInit should happen', () => {
    expect(submitWindowComponent).toBeTruthy();
  });

  it('SubmitWindowComponent: should properly load questionnaire form data and have correct results', () => {
    expect(submitWindowComponent.questionnaire).not.toBe(null);
    expect(submitWindowComponent.questionnaire.ages).not.toBe(null);
    expect(submitWindowComponent.questionnaire.ages.length).toBe(3);
    expect(submitWindowComponent.questionnaire.ages[1].id).toBe(1);
    expect(submitWindowComponent.questionnaire.ages[2].name).toBe('65+');
    expect(submitWindowComponent.questionnaire.studentStatus).not.toBe(null);
    expect(submitWindowComponent.questionnaire.studentStatus.length).toBe(2);
    expect(submitWindowComponent.questionnaire.studentStatus[0].id).toBe(0);
    expect(submitWindowComponent.questionnaire.studentStatus[1].name).toBe('Yes');
    expect(submitWindowComponent.questionnaire.incomes).not.toBe(null);
    expect(submitWindowComponent.questionnaire.incomes.length).toBe(4);
    expect(submitWindowComponent.questionnaire.incomes[3].id).toBe(3);
    expect(submitWindowComponent.questionnaire.incomes[1].name).toBe('1-12000');
  });

  it('SubmitWindowComponent: questionnaireDataSubscription unsubscription should be called on ngOnDestroy', () => {
    // Accessing object vis string literals since it is a private variable
    spyOn(submitWindowComponent['questionnaireDataSubscription'], 'unsubscribe');
    submitWindowComponent.ngOnDestroy();

    expect(submitWindowComponent['questionnaireDataSubscription'].unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('SubmitWindowComponent: questionnaireDataSubscription unsubscription should not happen for non-existant subscriptions if ngOnInit is not called', () => {
    submitWindowComponent['questionnaireDataSubscription'] = undefined;
    submitWindowComponent.ngOnDestroy();
    expect(submitWindowComponent['questionnaireDataSubscription']).not.toBeDefined();
  });

  it('SubmitWindowComponent: submitForm is properly initialised and with initial data', () => {
    expect(submitWindowComponent.submitForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      expect(submitWindowComponent.submitForm.form.controls['ageId']).toBeTruthy();
      expect(submitWindowComponent.submitForm.form.controls['isStudentId']).toBeTruthy();
      expect(submitWindowComponent.submitForm.form.controls['incomeId']).toBeTruthy();
    });
  });

  it('SubmitWindowComponent: submitForm should properly submit data when set', () => {
    expect(submitWindowComponent.submitForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      submitWindowComponent.submitForm.form.controls['ageId'].setValue('1');
      submitWindowComponent.submitForm.form.controls['isStudentId'].setValue('1');
      submitWindowComponent.submitForm.form.controls['incomeId'].setValue('1');

      submitWindowComponent.onSubmit(submitWindowComponent.submitForm);

      expect(submitWindowComponent.clientProducts).not.toBe(null);
      expect(submitWindowComponent.clientProducts.length).toBe(3);
      expect(submitWindowComponent.clientProducts[0].name).toBe('Current Account');
      expect(submitWindowComponent.clientProducts[1].id).toBe(3);
      expect(submitWindowComponent.clientProducts[2].requiredAgeIds).toEqual([1, 2]);
      expect(submitWindowComponent.clientProducts[1].requiredStudentStatus).toBe(1);
      expect(submitWindowComponent.clientProducts[0].requiredIncomeIds).toEqual([1, 2, 3]);
    });
  });

  it('SubmitWindowComponent: submitForm should  not submit data and return products if age info is lacking', () => {
    expect(submitWindowComponent.submitForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      submitWindowComponent.submitForm.form.controls['isStudentId'].setValue('1');
      submitWindowComponent.submitForm.form.controls['incomeId'].setValue('1');

      submitWindowComponent.onSubmit(submitWindowComponent.submitForm);

      expect(submitWindowComponent.clientProducts).toBe(null);
    });
  });

  it('SubmitWindowComponent: submitForm should  not submit data and return products if student status info is lacking', () => {
    expect(submitWindowComponent.submitForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      submitWindowComponent.submitForm.form.controls['ageId'].setValue('1');
      submitWindowComponent.submitForm.form.controls['incomeId'].setValue('1');

      submitWindowComponent.onSubmit(submitWindowComponent.submitForm);

      expect(submitWindowComponent.clientProducts).toBe(null);
    });
  });

  it('SubmitWindowComponent: submitForm should  not submit data and return products if income info is lacking', () => {
    expect(submitWindowComponent.submitForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      submitWindowComponent.submitForm.form.controls['ageId'].setValue('1');
      submitWindowComponent.submitForm.form.controls['isStudentId'].setValue('1');

      submitWindowComponent.onSubmit(submitWindowComponent.submitForm);

      expect(submitWindowComponent.clientProducts).toBe(null);
    });
  });

  it('SubmitWindowComponent: when submit form is null, client products are not extracted', () => {
    submitWindowComponent.onSubmit(null);

    expect(submitWindowComponent.clientProducts).toBe(null);
  });

  it('SubmitWindowComponent: when submit form is empty and invalid, client products are not extracted', () => {
    submitWindowComponent.onSubmit(submitWindowComponent.submitForm);

    expect(submitWindowComponent.clientProducts).toBe(null);
  });

  it('SubmitWindowComponent: should throw error', () => {
    const dataService = submitWindowFixture.debugElement.injector.get(DataService);
    spyOn(dataService, 'getQuestionnaireDataObservable').and.returnValue(throwError('Error'));

    submitWindowComponent.ngOnInit();
    expect(dataService.getQuestionnaireDataObservable).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    if (submitWindowFixture.nativeElement && 'remove' in submitWindowFixture.nativeElement) {
      (submitWindowFixture.nativeElement as HTMLElement).remove();
    }
  });
});
