import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/

describe('Debit bank account', () => {

    //should be able to debit a bank account
    it('should be able to debit a bank account', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/1/debit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error when the bank account is not found
    it('bank account is not found', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/debit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is inactive/dormant/draft
    it('You have to activate this account first', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/2/debit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});

describe('Credit a bank account', () => {

    //should be able to credit a bank account
    it('credit a bank account', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/1/credit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is not found
    it('bank account is not found', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/credit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is inactive/dormant/draft
    it('You have to activate this account first', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/2/credit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should not credit a bank account with no enough amount
    it('crediting a bank account with no enough amount', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/4/credit')
            .send({
                amount : 9000
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});
  