import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
const db = require('../db');

let expect = chai.expect;
chai.use(chaiHttp);
let usertoken ;let accountnumb;let accountnumb1;

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/



//should be able to fetch all bank accounts
describe('Bank account creation validation', () => {
        it('signup user', (done) => {
            chai.request(server)
            .post('/api/v1/auth/signup')
            .send({
              firstName: 'pankaj',
              lastName: 'vaswani',
              email: 'pankajvaswani@gmail.com',
              password: 'Pankaj@2019',
              confirmPassword: 'Pankaj@2019',
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              done();
            });
        });
  
        it('signin client with right credentials', (done) => {
            chai.request(server)
                .post('/api/v1/auth/signin')
                .send(
                    {
                        email: 'pankajvaswani@gmail.com',
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
          accountnumb = res.body.data.accountNumber;
          console.log(accountnumb)
          expect(res.body).to.be.an('object');
          done();
        });
    });
  
  
    it('dormant account created successfully', (done) => {
      chai.request(server)
        .post('/api/v1/accounts')
        .set('Authorization',usertoken)
        .send({
          type: 'dormant',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          accountnumb1 = res.body.data.accountNumber;
          console.log(accountnumb1)
          expect(res.body).to.be.an('object');
          done();
        });
    });
});
    
      //should not create a bank account if user email does not exist
      it('It should allow create saving account with Uppercase letters', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .set('Authorization',usertoken)
            .send({
                type: 'Saving'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('It should allow create dormant account with Uppercase letters', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .set('Authorization',usertoken)
            .send({
                type: 'Dormant'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Sorry your account type can be either saving ,current or dormant', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .set('Authorization',usertoken)
            .send({
                type: 'sssssssss'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });   


    //should not create a bank account when the account type is empty
    it('account type is empty', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .set('Authorization',usertoken)
            .send({
                type: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('the token is not provided', (done) => {
        chai.request(server)
          .post('/api/v1/accounts')
          .send({
            type: 'saving',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
      });

    //It should sign in user with the credentials
    it('signin Admin with right credentials', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signin')
            .send(
                {
                    email: 'shaluchandwani@rocketmail.com',
                    password: 'shalu@1993'
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                usertoken = res.body.data.token; 
                done();
            });
    });

    it('fetch all bank accounts', (done) => {
        chai.request(server)
            .get('/api/v1/accounts')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('fetch all active bank accounts', (done) => {
        chai.request(server)
            .get('/api/v1/accounts?status=active')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });


    it('fetch all dormant bank accounts', (done) => {
        chai.request(server)
            .get('/api/v1/accounts?status=active')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });


    it('spaces are not accepted in between', (done) => {
        chai.request(server)
            .get('/api/v2/user/pankajvas  wani@gmail.com/accounts')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('spaces are not accepted before or after ', (done) => {
        chai.request(server)
            .get('/api/v2/user/  pankajvaswani@gmail.com  /accounts')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Sorry your account status can be either active/draft/dormant', (done) => {
        chai.request(server)
            .patch('/api/v1/account/586')
            .set('Authorization',usertoken)
            .send({
                status: 'oopsesssss',
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

//should notify the staff/admin when the bank account is not found
    it('bank account is not found to delete', (done) => {
        chai.request(server)
            .delete('/api/v1/accounts/8')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });

        // it should not let bank account to be deleted if token is not passed
        it('the token is not provided', (done) => {
            chai.request(server)
                .delete('/api/v1/accounts/130')
                .send({
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    
        it('only numbers are allowed in the account number field', (done) => {
            chai.request(server)
                .delete('/api/v2/accounts/1hdvs30')
                .set('Authorization',usertoken)
                .send({
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
});