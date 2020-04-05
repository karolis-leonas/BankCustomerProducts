/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicWindowComponent } from './dynamic-window.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { DataService } from 'src/app/services/data.service';
import { MockDataService } from 'src/app/test/mock-services/mock-data.service';
import { throwError } from 'rxjs';

describe('DynamicWindowComponent', () => {
  let dynamicWindowComponent: DynamicWindowComponent;
  let submitWindowFixture: ComponentFixture<DynamicWindowComponent>;

  // Some assertions and equal checks did not work properly with arrays, therefore I had used manual array check
  const containsAll = (firstArray, secondArray) => secondArray.every(secondArrayItem => firstArray.includes(secondArrayItem))
  const sameMembers = (firstArray, secondArray) => containsAll(firstArray, secondArray) && containsAll(secondArray, firstArray);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: ProductsService, useClass: ProductsService},
        {provide: DataService, useClass: MockDataService}
      ]
    })
  }));

  beforeEach(() => {
    submitWindowFixture = TestBed.createComponent(DynamicWindowComponent);
    dynamicWindowComponent = submitWindowFixture.componentInstance;
    submitWindowFixture.detectChanges();
  });

  it('DynamicWindowComponent: should be created and ngOnInit should happen', () => {
    expect(dynamicWindowComponent).toBeTruthy();
  });

  it('DynamicWindowComponent: should properly load questionnaire form data and have correct results', () => {
    expect(dynamicWindowComponent.questionnaire).not.toBe(null);
    expect(dynamicWindowComponent.questionnaire.ages).not.toBe(null);
    expect(dynamicWindowComponent.questionnaire.ages.length).toBe(3);
    expect(dynamicWindowComponent.questionnaire.ages[1].id).toBe(1);
    expect(dynamicWindowComponent.questionnaire.ages[2].name).toBe('65+');
    expect(dynamicWindowComponent.questionnaire.studentStatus).not.toBe(null);
    expect(dynamicWindowComponent.questionnaire.studentStatus.length).toBe(2);
    expect(dynamicWindowComponent.questionnaire.studentStatus[0].id).toBe(0);
    expect(dynamicWindowComponent.questionnaire.studentStatus[1].name).toBe('Yes');
    expect(dynamicWindowComponent.questionnaire.incomes).not.toBe(null);
    expect(dynamicWindowComponent.questionnaire.incomes.length).toBe(4);
    expect(dynamicWindowComponent.questionnaire.incomes[3].id).toBe(3);
    expect(dynamicWindowComponent.questionnaire.incomes[1].name).toBe('1-12000');
  });

  it('DynamicWindowComponent: questionnaireDataSubscription unsubscription should be called on ngOnDestroy', () => {
    // Accessing object vis string literals since it is a private variable
    spyOn(dynamicWindowComponent['questionnaireDataSubscription'], 'unsubscribe');
    dynamicWindowComponent.ngOnDestroy();

    expect(dynamicWindowComponent['questionnaireDataSubscription'].unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('DynamicWindowComponent: questionnaireDataSubscription unsubscription should not happen for non-existant subscriptions if ngOnInit is not called', () => {
    dynamicWindowComponent['questionnaireDataSubscription'] = undefined;
    dynamicWindowComponent.ngOnDestroy();
    expect(dynamicWindowComponent['questionnaireDataSubscription']).not.toBeDefined();
  });

  it('DynamicWindowComponent: formChangesSubscription unsubscription should be called on ngOnDestroy', () => {
    // Accessing object vis string literals since it is a private variable
    spyOn(dynamicWindowComponent['formChangesSubscription'], 'unsubscribe');
    dynamicWindowComponent.ngOnDestroy();

    expect(dynamicWindowComponent['formChangesSubscription'].unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('DynamicWindowComponent: formChangesSubscription unsubscription should not happen for non-existant subscriptions if ngOnInit is not called', () => {
    dynamicWindowComponent['formChangesSubscription'] = undefined;
    dynamicWindowComponent.ngOnDestroy();
    expect(dynamicWindowComponent['formChangesSubscription']).not.toBeDefined();
  });

  it('DynamicWindowComponent: profileForm is properly initialised and with initial data', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      expect(dynamicWindowComponent.profileForm.controls['ageId']).toBeTruthy();
      expect(dynamicWindowComponent.profileForm.controls['isStudentId']).toBeTruthy();
      expect(dynamicWindowComponent.profileForm.controls['incomeId']).toBeTruthy();
    });
  });

  it('DynamicWindowComponent: profileForm is properly initialised and with initial data', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      expect(dynamicWindowComponent.profileForm.controls['ageId']).toBeTruthy();
      expect(dynamicWindowComponent.profileForm.controls['isStudentId']).toBeTruthy();
      expect(dynamicWindowComponent.profileForm.controls['incomeId']).toBeTruthy();
    });
  });

  it(`DynamicWindowComponent: component should only return Junior Saver Account product if,
    according to form, user is than 18 years old`, () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['ageId'].setValue('0');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['isStudentId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['incomeId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).not.toBe(null);

      expect(dynamicWindowComponent.clientProducts.length === 1).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[0].name === 'Junior Saver Account').toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[0].id === 2).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[0].requiredStudentStatus === 1).toBeFalsy();

      expect(dynamicWindowComponent.clientProducts[0].requiredAgeIds &&
        dynamicWindowComponent.clientProducts[0].requiredAgeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[0].requiredAgeIds, [0])).toBeTruthy();

      expect(dynamicWindowComponent.clientProducts[0].requiredIncomeIds).toBeFalsy();
    });
  });

  it('DynamicWindowComponent: component should return proper data once every profile form control is filled', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['ageId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['isStudentId'].setValue('0');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['incomeId'].setValue('2');
      expect(dynamicWindowComponent.clientProducts).not.toBe(null);
      expect(dynamicWindowComponent.clientProducts).not.toEqual(null);

      expect(dynamicWindowComponent.clientProducts.length === 3).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[0].name === 'Current Account').toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[1].id === 1).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[1].requiredStudentStatus).toBeFalsy();

      expect(dynamicWindowComponent.clientProducts[2].requiredAgeIds &&
        dynamicWindowComponent.clientProducts[2].requiredAgeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[2].requiredAgeIds, [1, 2])).toBeTruthy();

      expect(dynamicWindowComponent.clientProducts[2].requiredIncomeIds &&
        dynamicWindowComponent.clientProducts[2].requiredIncomeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[2].requiredIncomeIds, [2, 3])).toBeTruthy();
    });
  });

  it('DynamicWindowComponent: component should return proper data once every profile form control is filled and one field is changed', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['ageId'].setValue('2');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['isStudentId'].setValue('0');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['incomeId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).not.toBe(null);

      expect(dynamicWindowComponent.clientProducts.length === 3).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[1].name === 'Senior Account').toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[2].id === 5).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[2].requiredStudentStatus).toBeFalsy();

      expect(dynamicWindowComponent.clientProducts[1].requiredAgeIds &&
        dynamicWindowComponent.clientProducts[1].requiredAgeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[1].requiredAgeIds, [2])).toBeTruthy();

      expect(dynamicWindowComponent.clientProducts[0].requiredIncomeIds &&
        dynamicWindowComponent.clientProducts[0].requiredIncomeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[0].requiredIncomeIds, [1, 2, 3])).toBeTruthy();

      dynamicWindowComponent.profileForm.controls['ageId'].setValue('1');

      expect(dynamicWindowComponent.clientProducts).not.toEqual(null);

      expect(dynamicWindowComponent.clientProducts.length === 2).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[1].name === 'Debit Card').toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[0].id === 0).toBeTruthy();
      expect(dynamicWindowComponent.clientProducts[1].requiredStudentStatus).toBeFalsy();

      expect(dynamicWindowComponent.clientProducts[1].requiredAgeIds &&
        dynamicWindowComponent.clientProducts[1].requiredAgeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[1].requiredAgeIds, [1, 2])).toBeTruthy();

      expect(dynamicWindowComponent.clientProducts[0].requiredIncomeIds &&
        dynamicWindowComponent.clientProducts[0].requiredIncomeIds.length > 0 &&
        sameMembers(dynamicWindowComponent.clientProducts[0].requiredIncomeIds, [1, 2, 3])).toBeTruthy();
    });
  });

  it('DynamicWindowComponent: profileForm should not submit data and return products if age info is lacking', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['isStudentId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);


      dynamicWindowComponent.profileForm.controls['incomeId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);
    });
  });

  it('DynamicWindowComponent: profileForm should not submit data and return products if student status info is lacking', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['ageId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['incomeId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);
    });
  });

  it('DynamicWindowComponent: profileForm should not submit data and return products if income info is lacking', () => {
    expect(dynamicWindowComponent.profileForm).toBeTruthy();
    submitWindowFixture.detectChanges();

    submitWindowFixture.whenStable().then(() => {
      submitWindowFixture.detectChanges();
      dynamicWindowComponent.profileForm.controls['ageId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);

      dynamicWindowComponent.profileForm.controls['isStudentId'].setValue('1');
      expect(dynamicWindowComponent.clientProducts).toBe(null);
    });
  });

  it('DynamicWindowComponent: should throw error', () => {
    const dataService = submitWindowFixture.debugElement.injector.get(DataService);
    spyOn(dataService, 'getQuestionnaireDataObservable').and.returnValue(throwError('Error'));

    dynamicWindowComponent.ngOnInit();
    expect(dataService.getQuestionnaireDataObservable).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    if (submitWindowFixture.nativeElement && 'remove' in submitWindowFixture.nativeElement) {
      (submitWindowFixture.nativeElement as HTMLElement).remove();
    }
  });
});
