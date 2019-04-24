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
                    email: 'pankajvaswani555@rocketmail.com',
                    password: 'pankaj@1993'
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


    //should not create a bank account if user email does not exist
    it('user email does not exist', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: '',
                type: 'savings'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //it should let a staff/admin be able to activate/deactivate a bank account

    it('activate or deactivate a bank account', (done) => {
        chai.request(server)
            .patch('/api/v1/account/266')
            .set('Authorization',usertoken)
            .send({
                status: 'active',
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
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
            .delete('/api/v1/accounts/128')
            .set('Authorization',usertoken)
            .send({
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                console.log(res);
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
