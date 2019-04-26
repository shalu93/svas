# BANKA

[![npm version](https://badge.fury.io/js/heroku-api-plugin.svg)](http://badge.fury.io/js/heroku-api-plugin)
[![Build Status](https://travis-ci.com/shalu93/svas.svg?branch=master)](https://travis-ci.com/shalu93/svas)
[![Coverage Status](https://coveralls.io/repos/github/shalu93/svas/badge.svg?branch=testing-tests-travis-ci)](https://coveralls.io/github/shalu93/svas)  
[![Maintainability](https://api.codeclimate.com/v2/badges/6f9d176365640932903b/maintainability)](https://codeclimate.com/github/shalu93/svas)
 
Svas - Banka challenge - A core Banking Solution Product

# Description

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

i. Create a bank account. ii. View bank account profile (dashboard). iii. View account transaction_history. iv. Change Password -> additional option that was given in optional.

# API ENDPOINTS ROUTES

The app is hosted on heroku link for the same is : https://svas123.herokuapp.com/

## Documentation
| Methods | Endpoints | Actions |
| :----- | :----- | ----- |
| /GET | /api/v2/users | to get all users |
| /POST | /api/v2/auth/signup | Creating a User |
| /POST | /api/v2/auth/signin | Admin/Staff/Client Login |
| /GET | /api/v2/accounts | Get list of all accounts |
| /POST | /api/v2/accounts | Create a new account |
| /PATCH | /api/v2/account/:accountNumber | Update specified account |
| /DELETE | /api/v2/account/:accountNumber | Delete specified account |
| /POST | /api/v2/transactions/:accountNumber/debit | debit specified account |
| /POST | /api//v2/transactions/:accountNumber/credit | credit specified account |
| /GET | /api/v2/user/:useremail/accounts | Get account info of user via email |
| /GET | /api/v2/accounts/:accountNumber | Get account info of user via particular account |
| /POST | /api/v2/auth/signup/AdminClient | creating admin/staff user |
| /GET | /api/v2/accounts/:accountNumber/transactions | get transaction inquiry of a particular account |
| /GET | /api/v2/transactions/:transactionid | Get transaction inquiry via transaction id |
| /GET | /api/v2/accounts?status=active | Get list of all active accounts |
| /GET | /api/v2/accounts?status=dormant | Get list of all dormant accounts |


# Setting up Dev

## Clone the Repository to your local machine <br/>
```
git clone https://github.com/shalu93/svas.git
``` 

## Install dependencies <br/>
``` 
npm install
```

## Starting development server <br/> 
``` 
npm run start
```

## Run Tests <br/>
```
npm run test
```
## Contribute
```
Adding more API and tests will be appriciated.
```
## Deployment
```
The folder structure is very simple it will give an idea about what to add where.
```

