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
  
        it('signin client with right credentials', (done) => {
            chai.request(server)
                .post('/api/v2/auth/signin')
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
        .post('/api/v2/accounts')
        .set('Authorization',usertoken)
        .send({
          type: 'saving',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          accountnumb = res.body.data.accountNumber;
          expect(res.body).to.be.an('object');
          done();
        });
    });
  
  
    it('Current account created successfully', (done) => {
      chai.request(server)
        .post('/api/v2/accounts')
        .set('Authorization',usertoken)
        .send({
          type: 'current',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          accountnumb1 = res.body.data.accountNumber;
          expect(res.body).to.be.an('object');
          done();
        });
    });
    
      //should not create a bank account if user email does not exist
      it('It should allow create saving account with Uppercase letters', (done) => {
        chai.request(server)
            .post('/api/v2/accounts')
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

    it('It should allow create Current account with Uppercase letters', (done) => {
        chai.request(server)
            .post('/api/v2/accounts')
            .set('Authorization',usertoken)
            .send({
                type: 'Current'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Sorry your account type can be either saving ,current or dormant', (done) => {
        chai.request(server)
            .post('/api/v2/accounts')
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
            .post('/api/v2/accounts')
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
          .post('/api/v2/accounts')
          .send({
            type: 'saving',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
      });

    });
    
    
    describe('Bank account admin validation', () => {
    //It should sign in user with the credentials
    it('signin Admin with right credentials', (done) => {
        chai.request(server)
            .post('/api/v2/auth/signin')
            .send(
                {
                    email: 'shaluchandwani@rocketmail.com',
                    password: 'Pankaj@2019'
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
            .get('/api/v2/accounts')
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
            .get('/api/v2/accounts?status=active')
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
            .get('/api/v2/accounts?status=active')
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

    it('only positive numbers are allowed in the account number field', (done) => {
        chai.request(server)
            .get('/api/v2/accounts/-851')
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

    it('Sorry your account status can be either active/draft/dormant', (done) => {
        chai.request(server)
            .patch('/api/v2/account/586')
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

    it('The account status is already active', (done) => {
        chai.request(server)
            .patch(`/api/v2/account/${accountnumb}`)
            .set('Authorization',usertoken)
            .send({
                status: 'Active',
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
            .delete('/api/v2/accounts/8')
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
                .delete('/api/v2/accounts/130')
                .send({
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('the token is incorrect', (done) => {
            chai.request(server)
                .delete('/api/v2/accounts/130')
                .set('Authorization123',usertoken)
                .send({
                    Authorization:usertoken
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it(`Sucessfully deleted account ${accountnumb}`, (done) => {
            chai.request(server)
                .delete(`/api/v2/accounts/-${accountnumb}`)
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

        it(`Sucessfully deleted account ${accountnumb}`, (done) => {
            chai.request(server)
                .delete(`/api/v2/accounts/${accountnumb}`)
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
    

});