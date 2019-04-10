svas
Svas - Banka challenge - A core Banking Solution Product (UI Only)

[![Build Status](https://travis-ci.com/shalu93/svas.svg?branch=master)](https://travis-ci.com/shalu93/svas)
[![Coverage Status](https://coveralls.io/repos/github/shalu93/svas/badge.svg?branch=testing-tests-travis-ci)]
 

1 Login Page ---->>

It has 2 buttons - 

a. Submit -> Account type must be selected before submitting otherwise it will show blank page with a message "Please select account Type" Also On the Basis of Account Type the Page will display Different Links . Admin / Client / Staff Rights are restricted via this way.

b. Signup -> User (Client) can signup from here all the Important details are mentioned to enter.

Home Page ------->
This has 3 parts Admin/Staff/Client

a. Admin -->

i. Activate or deactivate user account -> this has text box to enter the user account number so that we can perform action on that account ii. Create admin or staff user account -> This directly takes you to create admin/staff page. iii. View list of all bank accounts -> This will Show the list of all bank accounts. iv. View a specific bank account record -> this has a submit button to show the details of specific bank account. v. Delete a specific account-> this deletes the specific bank account and also gives alert message when you submit.

b. Staff -->

i. Credit a user account -> only staff can perform credit/debit ii. Debit a user account. -> have provided a radio button to select 1 option. iii. View list of all bank accounts -> This will Show the list of all bank accounts. iv. View a specific bank account record -> this has a submit button to show the details of specific bank account. v. Delete a specific account-> this deletes the specific bank account and also gives alert message when you submit.

c. Client -->

I have tried to use various functions of html to showcase , so this page will show you the hover buttons for submit

i. Create a bank account. ii. View bank account profile (dashboard). iii. View account transaction history. iv. Change Password -> additional option that was given in optional.


# Setting up Dev

## Clone the Repository to your local machine <br/>
```
git clone https://github.com/shalu93/svas.git
``` 

## Install dependencies <br/>
``` 
npm install
npm install express
npm install --save-dev nodemon
npm install body-parser
npm install validator
npm install eslint --save-dev
npm install --save-dev @babel/core @babel/node
npm install --save-dev @babel/register
npm install --save-dev @babel/cli
npm install --save-dev @babel/preset-env
npm install bcrypt
npm install jsonwebtoken
npm i --save lodash.isempty
npm install chai
npm install chai-http
npm install dotenv
npm install --save-dev mocha
npm i nyc --save-dev
npm install coveralls --save-dev
npm install mocha-lcov-reporter --save-dev
npm install -g heroku
```

## Starting development server <br/> 
``` 
npm run start
```

## Run Tests <br/>
```
npm run test
```

# API ENDPOINTS ROUTES
| Methods | Endpoints | Actions |
| :----- | :----- | ----- |
| /GET | /api/v1/users | to get all users |
| /POST | /api/v1/auth/signup | Creating a User |
| /POST | /api/v1/auth/signin | Admin/Staff/Client Login |
| /GET | /api/v1/accounts | Get list of all accounts |
| /POST | /api/v1/accounts | Create a net account |
| /PATCH | /api/v1/account/:accountNumber | Update specified account |
| /DELETE | /api/v1/account/:accountNumber | Delete specified account |
| /POST | /api/v1/transactions/:accountNumber/debit | debit specified account |
| /POST | /api//v1/transactions/:accountNumber/credit | credit specified account |
