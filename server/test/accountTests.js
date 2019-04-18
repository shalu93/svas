import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


let expect = chai.expect;
chai.use(chaiHttp);

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/

//should be able to fetch all bank accounts
describe('Bank account validations', () => {
    it('fetch all bank accounts', (done) => {
        chai.request(server)
            .get('/api/v1/accounts')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should be able to create a bank account
    it('create a bank account', (done) => {
        chai.request(server)
            .post('/api/v1/accounts')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@svasbanka.com',
                type: 'saving'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
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
            .patch('/api/v1/account/1')
            .send({
                status: 'active'
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
            .send()
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    // it should give an error if the bank account is not found
    it('bank account is not found', (done) => {
        chai.request(server)
            .patch('/api/v1/account/7')
            .send({
                status: 'active'
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
            .delete('/api/v1/accounts/1')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(200);
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
