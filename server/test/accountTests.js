import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


let expect = chai.expect;
chai.use(chaiHttp);
let usertoken ;

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/



//should be able to fetch all bank accounts
describe('Bank account validations', () => {


    //It should sign in user with the credentials
    it('signin user with right credentials', (done) => {
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
            .get('/api/v1/accounts?status=dormant')
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


    it('only numbers are allowed in the account number field', (done) => {
        chai.request(server)
            .get('/api/v1/accounts/badc1235')
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

    it('only numbers are allowed in the account number field', (done) => {
        chai.request(server)
            .get('/api/v1/user/davidmathenge123@gmail.com/accounts')
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


    //should not create a bank account if user email does not exist
    it('user email does not exist', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: '',
                type: 'saving'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Sorry your account type can be either saving ,current or dormant', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@gmail.com',
                type: 'sssssssss'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('create bank account', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@gmail.com',
                type: 'Saving'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });   


    //it should let a staff/admin be able to activate/deactivate a bank account

    it('The status is already active', (done) => {
        chai.request(server)
            .patch('/api/v1/account/586')
            .set('Authorization',usertoken)
            .send({
                status: 'active',
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('activate or deactivate a bank account', (done) => {
        chai.request(server)
            .patch('/api/v1/account/586')
            .set('Authorization',usertoken)
            .send({
                status: 'dormant',
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('only numbers are allowed in the account number field', (done) => {
        chai.request(server)
            .patch('/api/v1/account/5ssewd53')
            .set('Authorization',usertoken)
            .send({
                status: 'active',
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



    // it should let a staff/admin delete a specific bank account
    it('deleted a bank account', (done) => {
        chai.request(server)
            .delete('/api/v1/accounts/130')
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

    it('only numbers are allowed in the account number field', (done) => {
        chai.request(server)
            .delete('/api/v1/accounts/1hdvs30')
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


    //should not create a bank account when the account type is empty
    it('account type is empty', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@svasbanka.com',
                type: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });



});
