# BankCustomerProducts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Main problem

The bank is producing a tool to recommend list of products to prospective customers. The rules which govern what products a customer may choose are based upon answers to questions that the customer has given.

## Key points for solution

I have decided to do two examples (on separate routes within single project) for this problem since I thought it would be useful to showcase multiple ways such problem could be solved. Additionally it showcases other parts of Angular (i.e. routing or component hierarchy, component re-usage).

You can go to different pages via navbar at the top of the page.

### Dropdown and automatic calculation example

In this example user has to answer questions by using dropdowns. Once all dropdowns are selected, the app will automatically request products and once they are extracted, they should be shown on table below. If there are no products, a warning block is shown. This part showcases reactive forms and form changes listening logic.

### Radio button submit example

In this example user has to answer questions by selecting radio buttons. Once all questions are answered, user must submit the request and it should return products which do meet the requirements. Products should be shown on a table below the form block, if there are no products, a warning block is shown. This part showcases template driven forms and form submit logic.

### Data extraction logic

Since this project does not have a "proper" backend, it uses JSON files instead for data extraction (I thought it would be similiar to a usual request to API endpoint with JSON representation). Such data is both mapped and cached to both sessionStorage and data service variables.

### Design and styling

This project uses Bootstrap (version 4.4.1) styles, layouts and other design parts. Its pages are responsive to screen/window width and should work on screens with width from 320 pixels or more.

## Launching a development server

This project has multiple development configurations for different builds:
- In order to execute modern build (es2015), please run `ng serve`.
- In order to execute legacy build (es5), please run `ng serve -c es5`.

Take note that modern build does not work on older browsers, such as Internet Explorer 11.

## Running unit tests

This project also has unit tests, which were written for all major components and services. 

In order to execute them, you should run `ng test`. Additionally, if you want to see code coverage, please add the `--code-coverage` command next to main command (full text would be `ng test --code-coverage`). This additionally generates coverage information and report page (inside `coverage` folder which should be shown in main project folder).

Code coverage for this project is:
- 100% Statements 137/137
- 100% Branches 71/71
- 100% Functions 43/43
- 100% Lines 130/130
