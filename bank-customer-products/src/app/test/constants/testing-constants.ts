import { QuestionnaireModel } from '../../models/questionnaire.model';
import { ProductModel } from '../../models/product.model';

export class TestingConstants {
  public static readonly MockQuestionnaire: QuestionnaireModel = {
    ages: [
      {
        id: 0,
        name: '0-17'
      },
      {
        id: 1,
        name: '18-64'
      },
      {
        id: 2,
        name: '65+'
      }
    ],
    studentStatus: [
      {
        id: 0,
        name: 'No'
      },
      {
        id: 1,
        name: 'Yes'
      }
    ],
    incomes: [
      {
        id: 0,
        name: '0'
      },
      {
        id: 1,
        name: '1-12000'
      },
      {
        id: 2,
        name: '12001-40000'
      },
      {
        id: 3,
        name: '40001+'
      }
    ]
  };

  public static readonly MockEmptyQuestionnaire: QuestionnaireModel = {
    ages: [ ],
    studentStatus: [ ],
    incomes: [ ]
  };

  public static readonly MockProducts: ProductModel[] = [
    {
      id: 0,
      name: 'Current Account',
      requiredAgeIds: [ 1, 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 1, 2, 3 ]
    },
    {
      id: 1,
      name: 'Current Account Plus',
      requiredAgeIds: [ 1, 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 2, 3 ]
    },
    {
      id: 2,
      name: 'Junior Saver Account',
      requiredAgeIds: [ 0 ],
      requiredStudentStatus: null,
      requiredIncomeIds: null
    },
    {
      id: 3,
      name: 'Student Account',
      requiredAgeIds:  [ 1, 2 ],
      requiredStudentStatus: 1,
      requiredIncomeIds: null
    },
    {
      id: 4,
      name: 'Senior Account',
      requiredAgeIds: [ 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 1, 2, 3 ]
    },
    {
      id: 5,
      name: 'Debit Card',
      requiredAgeIds: [ 1, 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 0, 1 ]
    },
    {
      id: 6,
      name: 'Credit Card',
      requiredAgeIds: [ 1, 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 2, 3 ]
    },
    {
      id: 7,
      name: 'Gold Credit Card',
      requiredAgeIds:  [ 1, 2 ],
      requiredStudentStatus: null,
      requiredIncomeIds: [ 3 ]
    }
  ]
}
