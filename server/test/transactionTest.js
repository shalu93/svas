import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);
let usertoken;let AcctNum;

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/

describe('Bank account creation validation', () => {

    it('signin client with right credentials', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signin')
            .send(
                {
                    email: 'pankajvaswani@rocketmail.com',
                    password: 'Pankaj@2019'
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                usertoken = res.body.data.token; 
                done();
            });
    }); 


//create bank account 

it('saving account created successfully', (done) => {
  chai.request(server)
    .post('/api/v1/accounts')
    .set('Authorization',usertoken)
    .send({
      type: 'saving',
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      AcctNum = res.body.data.accountNumber;
      expect(res.body).to.be.an('object');
      done();
    });
});

    //It should sign in user with the credentials
    it('signin staff with right credentials', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signin')
            .send(
                {
                    email: 'sakshichandwani@rocketmail.com',
                    password: 'Pankaj@2019'
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                usertoken = res.body.data.token; 
                done();
            });
    }); 

        //should be able to credit a bank account
        it('credit a bank account', (done) => {
            chai.request(server)
                .post(`/api/v1/transactions/${AcctNum}/credit`)
                .set('Authorization',usertoken)
                .send({
                    amount : 1120,
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    console.log(AcctNum)
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('only positive values accepted for amount field', (done) => {
            chai.request(server)
                .post(`/api/v1/transactions/${AcctNum}/credit`)
                .set('Authorization',usertoken)
                .send({
                    amount : -1120,
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    console.log(AcctNum)
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('only numbers will be accepted for account number and amount', (done) => {
            chai.request(server)
                .post('/api/v1/transactions/ds129c/debit')
                .set('Authorization',usertoken)
                .send({
                    amount : '1rfd',
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });      

    //should be able to debit a bank account
    it('should be able to debit a bank account', (done) => {
        chai.request(server)
            .post(`/api/v1/transactions/${AcctNum}/debit`)
            .set('Authorization',usertoken)
            .send({
                amount : 1,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error when the bank account is not found
    it('no accounts found to perform the transaction', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/debit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });


        //should not debit a bank account with no enough amount
        it('your accounts doesnot have enough funds', (done) => {
            chai.request(server)
                .post(`/api/v1/transactions/${AcctNum}/debit`)
                .set('Authorization',usertoken)
                .send({
                    amount : 20000,
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('only positive values are accepted for amount field', (done) => {
            chai.request(server)
                .post(`/api/v1/transactions/${AcctNum}/debit`)
                .set('Authorization',usertoken)
                .send({
                    amount : -20000,
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

    it('only numbers will be accepted for account number and amount', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/ds129c/credit')
            .set('Authorization',usertoken)
            .send({
                amount : '1rfd',
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    }); 

    //should give an error if the bank account is not found
    it('no accounts found to perform the transaction', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/credit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });


});
  